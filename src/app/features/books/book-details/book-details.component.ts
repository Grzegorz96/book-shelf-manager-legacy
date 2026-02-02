import { Component, input, resource, effect, Resource } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ReadingTimePipe } from '@core/pipes';
import { BooksService } from '../books.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorModalService } from '@shared/error-modal';
import { BookModalComponent } from '../book-modal';
import { Book } from '../book.interface';

@Component({
  selector: 'app-book-details',
  imports: [LucideAngularModule, ReadingTimePipe, BookModalComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent {
  readonly id = input.required<string>();
  protected readonly bookResource: Resource<Book | undefined>;

  constructor(
    private readonly booksService: BooksService,
    private readonly router: Router,
    private readonly errorModalService: ErrorModalService
  ) {
    this.bookResource = resource({
      params: () => ({ id: this.id() }),
      loader: ({ params }) => this.booksService.getBook(params.id),
    });

    effect(() => {
      const err = this.bookResource.error();
      if (!err) return;
      const isNotFound = err instanceof HttpErrorResponse && err.status === 404;
      const title = isNotFound ? 'Book not found' : 'Error getting book';
      const message = isNotFound
        ? 'The book you are trying to view does not exist or has been removed.'
        : 'An error occurred while getting the book. Please try again later.';
      this.errorModalService.openErrorModal({
        title,
        message,
        dismissLabel: 'Back to Library',
        onDismiss: () => this.handleClose(),
      });
    });
  }

  handleClose() {
    this.router.navigate(['/books']);
  }
}

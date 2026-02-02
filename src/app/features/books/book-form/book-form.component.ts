import { Component, input, signal, effect, Resource, resource } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { Book } from '../book.interface';
import { form, required, submit, minLength, max, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { BooksService } from '../books.service';
import { ErrorModalService } from '@shared/error-modal';
import { BookModalComponent } from '../book-modal';

type BookFormModel = Omit<Book, 'id'>;

@Component({
  selector: 'app-book-form',
  imports: [LucideAngularModule, FormField, BookModalComponent],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent {
  readonly id = input<string>();
  protected readonly bookResource: Resource<Book | undefined>;

  private readonly _bookFormSignal = signal<BookFormModel>({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    description: '',
    genre: '',
    isFavorite: false,
  });

  protected readonly bookForm = form(this._bookFormSignal, (fieldPath) => {
    const currentYear = new Date().getFullYear();

    required(fieldPath.title, { message: 'Title is required' });
    minLength(fieldPath.title, 2, { message: 'Title must be at least 2 character' });
    required(fieldPath.author, { message: 'Author is required' });
    minLength(fieldPath.author, 2, { message: 'Author must be at least 2 character' });
    required(fieldPath.year, { message: 'Year is required' });
    max(fieldPath.year, currentYear, { message: `Year must be in the past` });
    required(fieldPath.description, { message: 'Description is required' });
    minLength(fieldPath.description, 10, { message: 'Description must be at least 10 characters' });
    required(fieldPath.genre, { message: 'Genre is required' });
    minLength(fieldPath.genre, 2, { message: 'Genre must be at least 2 character' });
  });

  constructor(
    private readonly router: Router,
    private readonly booksService: BooksService,
    private readonly errorModalService: ErrorModalService
  ) {
    this.bookResource = resource({
      params: () => ({ id: this.id() }),
      loader: async ({ params }) => {
        if (!params.id) return;
        return await this.booksService.getBook(params.id);
      },
    });

    effect(() => {
      if (this.bookResource.error()) {
        return;
      }
      const bookFromApi = this.bookResource.value();
      if (bookFromApi) {
        this._bookFormSignal.set({
          title: bookFromApi.title,
          author: bookFromApi.author,
          year: bookFromApi.year,
          description: bookFromApi.description,
          genre: bookFromApi.genre,
          isFavorite: bookFromApi.isFavorite,
        });
      }
    });

    effect(() => {
      const err = this.bookResource.error();
      if (!err) return;
      const isNotFound = err instanceof HttpErrorResponse && err.status === 404;
      const title = isNotFound ? 'Book not found' : 'Error getting book';
      const message = isNotFound
        ? 'The book you are trying to edit does not exist or has been removed.'
        : 'An error occurred while getting the book. Please try again later.';
      this.errorModalService.openErrorModal({
        title,
        message,
        dismissLabel: 'Back to Library',
        onDismiss: () => this.handleCancel(),
      });
    });
  }

  private async saveProcess(formValue: BookFormModel): Promise<void> {
    const id = this.id();
    try {
      if (id) {
        const updatedBook = await this.booksService.updateBook(id, formValue);
        this.booksService.updateCacheAfterEdit(updatedBook);
      } else {
        const createdBook = await this.booksService.createBook(formValue);
        this.booksService.updateCacheAfterAdd(createdBook);
      }
      this.router.navigate(['/books']);
    } catch {
      this.errorModalService.openErrorModal({
        title: `Error ${id ? 'updating' : 'creating'} book`,
        message: `An error occurred while ${id ? 'updating' : 'creating'} the book.`,
        actionLabel: 'Retry',
        onAction: () => this.saveProcess(formValue),
      });
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    submit(this.bookForm, (form) => this.saveProcess(form().value()));
  }

  handleCancel(): void {
    this.router.navigate(['/books']);
  }
}

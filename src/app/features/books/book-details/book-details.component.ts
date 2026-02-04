import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ReadingTimePipe } from '@core/pipes';
import { BooksService } from '../books.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorModalService } from '@shared/error-modal';
import { BookModalComponent } from '../book-modal';
import { Book } from '../book.interface';
import {
  BehaviorSubject,
  switchMap,
  shareReplay,
  filter,
  map,
  startWith,
  catchError,
  of,
  Observable,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';

interface BookState {
  data: Book | null;
  isLoading: boolean;
  error: string | null;
}

// Book details component in declarative style of data flow
@Component({
  selector: 'app-book-details',
  imports: [LucideAngularModule, ReadingTimePipe, BookModalComponent, AsyncPipe],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent {
  constructor(
    private readonly booksService: BooksService,
    private readonly router: Router,
    private readonly errorModalService: ErrorModalService
  ) {}

  protected readonly id$ = new BehaviorSubject<string | null>(null);

  @Input() set id(value: string) {
    this.id$.next(value);
  }

  protected readonly state$: Observable<BookState> = this.id$.pipe(
    filter((id): id is string => !!id && id.trim() !== ''),
    switchMap((id) =>
      this.booksService.getBook(id).pipe(
        map((book) => ({ data: book, isLoading: false, error: null })),
        startWith({ data: null, isLoading: true, error: null }),
        catchError((err) => {
          const isNotFound = err instanceof HttpErrorResponse && err.status === 404;
          this.errorModalService.openErrorModal({
            title: isNotFound ? 'Book not found' : 'Error getting book',
            message: isNotFound
              ? 'The book you are trying to view does not exist or has been removed.'
              : 'An error occurred while getting the book details. Please try again later.',
            dismissLabel: 'Back to Library',
            onDismiss: () => this.handleClose(),
          });
          return of({ data: null, isLoading: false, error: err });
        })
      )
    ),
    shareReplay(1)
  );

  handleClose() {
    this.router.navigate(['/books']);
  }
}

import { Component, DestroyRef } from '@angular/core';
import { BooksService, type BooksState } from './books.service';
import { BookCardComponent } from './book-card/book-card.component';
import { BookCardSkeletonComponent } from './book-card-skeleton/book-card-skeleton.component';
import { LucideAngularModule } from 'lucide-angular';
import { ErrorModalService } from '@shared/error-modal';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { Router, RouterOutlet } from '@angular/router';
import { Book } from './book.interface';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-books',
  imports: [
    BookCardComponent,
    BookCardSkeletonComponent,
    LucideAngularModule,
    FilterBarComponent,
    RouterOutlet,
    AsyncPipe,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  protected readonly skeletons = Array(9).fill(0);

  protected readonly filterGenre$ = new BehaviorSubject<string>('');
  protected readonly booksResource$: Observable<BooksState>;
  protected readonly filteredBooks$: Observable<Book[]>;

  constructor(
    private readonly booksService: BooksService,
    private readonly errorModalService: ErrorModalService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {
    this.booksResource$ = this.booksService.state$;

    this.filteredBooks$ = combineLatest([this.booksResource$, this.filterGenre$]).pipe(
      map(([state, filter]) => {
        const allBooks = state.data;
        const cleanFilter = filter.toLowerCase().trim();

        if (!cleanFilter) return allBooks;

        return allBooks.filter((book) => book.genre.toLowerCase().includes(cleanFilter));
      })
    );

    this.booksResource$
      .pipe(
        map((state) => state.error),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((error) => {
        if (error) {
          this.errorModalService.openErrorModal({
            title: 'Error loading books',
            message: error,
            actionLabel: 'Retry',
            onAction: () => this.booksService.reloadCache(),
          });
        }
      });
  }

  handleDeleteBook(id: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.booksService
        .deleteBook(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (deletedBook: Book) => {
            this.booksService.updateCacheAfterDelete(deletedBook.id);
          },
          error: () => {
            this.errorModalService.openErrorModal({
              title: 'Error deleting book',
              message: 'An error occurred while deleting the book.',
              actionLabel: 'Retry',
              onAction: async (): Promise<void> => this.handleDeleteBook(id),
            });
          },
        });
    }
  }

  handleToggleFavorite(id: string, isFavorite: boolean) {
    this.booksService
      .toggleFavorite(id, isFavorite)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedBook: Book) => {
          this.booksService.updateCacheAfterToggleFavorite(updatedBook);
        },
        error: () => {
          this.errorModalService.openErrorModal({
            title: 'Error updating favorite',
            message: 'An error occurred while updating the book.',
            actionLabel: 'Retry',
            onAction: async (): Promise<void> => this.handleToggleFavorite(id, isFavorite),
          });
        },
      });
  }

  handleFilterOutput(category: string) {
    this.filterGenre$.next(category);
  }

  handleViewDetails(id: string) {
    this.router.navigate(['/books', id, 'details']);
  }

  handleAddBook() {
    this.router.navigate(['/books/new']);
  }

  handleEditBook(id: string) {
    this.router.navigate(['/books', id, 'edit']);
  }
}

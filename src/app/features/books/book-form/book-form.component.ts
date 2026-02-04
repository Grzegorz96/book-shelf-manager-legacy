import { Component, Input, DestroyRef, OnInit } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Book } from '../book.interface';
import { Router } from '@angular/router';
import { BooksService } from '../books.service';
import { ErrorModalService } from '@shared/error-modal';
import { BookModalComponent } from '../book-modal';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe, AsyncPipe } from '@angular/common';
import { ValidationErrorPipe } from '@core/pipes';
import { BehaviorSubject, EMPTY, filter, tap, switchMap, catchError, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

type BookFormModel = Omit<Book, 'id'>;

interface BookState {
  data: Book | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

// Book form component in imperative style of data flow
@Component({
  selector: 'app-book-form',
  imports: [
    LucideAngularModule,
    BookModalComponent,
    ReactiveFormsModule,
    KeyValuePipe,
    ValidationErrorPipe,
    AsyncPipe,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent implements OnInit {
  protected readonly id$ = new BehaviorSubject<string | null>(null);

  protected readonly state$ = new BehaviorSubject<BookState>({
    data: null,
    isLoading: false,
    isSaving: false,
    error: null,
  });

  @Input() set id(value: string) {
    this.id$.next(value);
  }

  protected readonly bookForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    author: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    year: new FormControl(new Date().getFullYear(), {
      nonNullable: true,
      validators: [Validators.required, Validators.max(new Date().getFullYear())],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    genre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    isFavorite: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private readonly router: Router,
    private readonly booksService: BooksService,
    private readonly errorModalService: ErrorModalService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.id$
      .pipe(
        tap((id) => {
          const isEdit = !!id;

          this.state$.next({
            ...this.state$.value,
            data: null,
            isLoading: isEdit,
            error: null,
          });

          if (!isEdit) this.bookForm.reset();
        }),
        filter((id): id is string => !!id),
        switchMap((id) =>
          this.booksService.getBook(id).pipe(
            catchError((err) => {
              const isNotFound = err instanceof HttpErrorResponse && err.status === 404;
              const title = isNotFound ? 'Book not found' : 'Error getting book';
              const message = isNotFound
                ? 'The book you are trying to edit does not exist or has been removed.'
                : 'An error occurred while getting the book. Please try again later.';

              this.state$.next({ ...this.state$.value, isLoading: false, error: message });

              this.errorModalService.openErrorModal({
                title,
                message,
                dismissLabel: 'Back to Library',
                onDismiss: () => this.handleCancel(),
              });
              return EMPTY;
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((book) => {
        this.state$.next({ ...this.state$.value, data: book, isLoading: false });
        this.bookForm.patchValue(book);
      });
  }

  private saveProcess(formValue: BookFormModel): void {
    const id = this.id$.value;

    this.state$.next({ ...this.state$.value, isSaving: true });

    const request$ = id
      ? this.booksService.updateBook(id, formValue).pipe(
          tap((updatedBook) => {
            this.booksService.updateCacheAfterEdit(updatedBook);
          })
        )
      : this.booksService.createBook(formValue).pipe(
          tap((createdBook) => {
            this.booksService.updateCacheAfterAdd(createdBook);
          })
        );

    request$
      .pipe(
        finalize(() => this.state$.next({ ...this.state$.value, isSaving: false })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: () => {
          this.errorModalService.openErrorModal({
            title: `Error ${id ? 'updating' : 'creating'} book`,
            message: `An error occurred while ${id ? 'updating' : 'creating'} the book.`,
            actionLabel: 'Retry',
            onAction: () => this.saveProcess(formValue),
          });
        },
      });
  }

  handleSubmit(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.getRawValue();
      this.saveProcess(formValue);
    } else {
      this.bookForm.markAllAsTouched();
    }
  }

  handleCancel(): void {
    this.router.navigate(['/books']);
  }
}

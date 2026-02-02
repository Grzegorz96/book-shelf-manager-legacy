import { Component, input, effect, Resource, resource } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { Book } from '../book.interface';
import { Router } from '@angular/router';
import { BooksService } from '../books.service';
import { ErrorModalService } from '@shared/error-modal';
import { BookModalComponent } from '../book-modal';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { ValidationErrorPipe } from '@core/pipes';

type BookFormModel = Omit<Book, 'id'>;

@Component({
  selector: 'app-book-form',
  imports: [
    LucideAngularModule,
    BookModalComponent,
    ReactiveFormsModule,
    KeyValuePipe,
    ValidationErrorPipe,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent {
  readonly id = input<string>();
  protected readonly bookResource: Resource<Book | undefined>;

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
        this.bookForm.patchValue({
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from './book.interface';
import { BehaviorSubject, delay, finalize } from 'rxjs';

export interface BooksState {
  data: Book[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private readonly baseUrl = 'http://localhost:3001';

  private readonly _state$ = new BehaviorSubject<BooksState>({
    data: [],
    isLoading: false,
    error: null,
  });

  public readonly state$ = this._state$.asObservable();

  constructor(private readonly http: HttpClient) {
    this.loadBooks();
  }

  private get state(): BooksState {
    return this._state$.value;
  }

  private updateState(patch: Partial<BooksState>) {
    this._state$.next({ ...this.state, ...patch });
  }

  public loadBooks(): void {
    this.updateState({ isLoading: true, error: null });

    this.getBooks()
      .pipe(finalize(() => this.updateState({ isLoading: false })))
      .subscribe({
        next: (books) => this.updateState({ data: books }),
        error: (err) => {
          console.error(err);
          this.updateState({ error: 'Failed to load books' });
        },
      });
  }

  public reloadCache() {
    this.loadBooks();
  }

  public updateCacheAfterAdd(newBook: Book) {
    this.updateState({ data: [...this.state.data, newBook] });
  }

  public updateCacheAfterEdit(updatedBook: Book) {
    this.updateState({
      data: this.state.data.map((book) => (book.id === updatedBook.id ? updatedBook : book)),
    });
  }

  public updateCacheAfterDelete(id: string) {
    this.updateState({ data: this.state.data.filter((book) => book.id !== id) });
  }

  public updateCacheAfterToggleFavorite(updatedBook: Book) {
    this.updateState({
      data: this.state.data.map((book) => (book.id === updatedBook.id ? updatedBook : book)),
    });
  }

  public getBooks() {
    return this.http.get<Book[]>(`${this.baseUrl}/books`).pipe(delay(1000));
  }

  public getBook(id: string) {
    return this.http.get<Book>(`${this.baseUrl}/books/${id}`).pipe(delay(500));
  }

  public createBook(book: Omit<Book, 'id'>) {
    return this.http.post<Book>(`${this.baseUrl}/books`, book).pipe(delay(500));
  }

  public updateBook(id: string, book: Partial<Book>) {
    return this.http.patch<Book>(`${this.baseUrl}/books/${id}`, book).pipe(delay(500));
  }

  public deleteBook(id: string) {
    return this.http.delete<Book>(`${this.baseUrl}/books/${id}`).pipe(delay(500));
  }

  public toggleFavorite(id: string, isFavorite: boolean) {
    return this.http.patch<Book>(`${this.baseUrl}/books/${id}`, { isFavorite }).pipe(delay(500));
  }
}

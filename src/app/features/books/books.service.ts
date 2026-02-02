import { Injectable, ResourceRef, Resource, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from './book.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private readonly baseUrl = 'http://localhost:3001';
  private readonly _booksResource: ResourceRef<Book[] | undefined>;
  public readonly booksResource: Resource<Book[] | undefined>;

  constructor(private readonly http: HttpClient) {
    this._booksResource = resource({
      loader: () => this.getBooks(),
    });
    this.booksResource = this._booksResource.asReadonly();
  }

  public updateCacheAfterAdd(newBook: Book) {
    this._booksResource.update((books) => (books ? [...books, newBook] : books));
  }

  public updateCacheAfterEdit(updatedBook: Book) {
    this._booksResource.update((books) =>
      books?.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  }

  public updateCacheAfterDelete(id: string) {
    this._booksResource.update((books) => books?.filter((book) => book.id !== id));
  }

  public updateCacheAfterToggleFavorite(updatedBook: Book) {
    this._booksResource.update((books) =>
      books?.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  }

  public reloadCache() {
    this._booksResource.reload();
  }

  public getBooks() {
    return new Promise<Book[]>((resolve) => {
      setTimeout(() => {
        resolve(firstValueFrom(this.http.get<Book[]>(`${this.baseUrl}/books`)));
      }, 1000);
    });
  }

  public getBook(id: string) {
    return new Promise<Book>((resolve) => {
      setTimeout(() => {
        resolve(firstValueFrom(this.http.get<Book>(`${this.baseUrl}/books/${id}`)));
      }, 500);
    });
  }

  public createBook(book: Omit<Book, 'id'>) {
    return firstValueFrom(this.http.post<Book>(`${this.baseUrl}/books`, book));
  }

  public updateBook(id: string, book: Partial<Book>) {
    return firstValueFrom(this.http.patch<Book>(`${this.baseUrl}/books/${id}`, book));
  }

  public deleteBook(id: string) {
    return firstValueFrom(this.http.delete<Book>(`${this.baseUrl}/books/${id}`));
  }

  public toggleFavorite(id: string, isFavorite: boolean) {
    return firstValueFrom(this.http.patch<Book>(`${this.baseUrl}/books/${id}`, { isFavorite }));
  }
}

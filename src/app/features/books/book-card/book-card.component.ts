import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from '../book.interface';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-book-card',
  imports: [LucideAngularModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;

  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onToggleFavorite = new EventEmitter<{ id: string; isFavorite: boolean }>();
  @Output() onViewDetails = new EventEmitter<string>();

  handleEdit() {
    this.onEdit.emit(this.book.id);
  }

  handleDelete() {
    this.onDelete.emit(this.book.id);
  }

  handleToggleFavorite() {
    this.onToggleFavorite.emit({
      id: this.book.id,
      isFavorite: !this.book.isFavorite,
    });
  }

  handleViewDetails() {
    this.onViewDetails.emit(this.book.id);
  }
}

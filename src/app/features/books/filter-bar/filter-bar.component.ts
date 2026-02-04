import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  imports: [FormsModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent {
  @Input({ required: true }) public isDisabled!: boolean;
  @Output() protected readonly filterOutput = new EventEmitter<string>();

  protected readonly filterForm = new FormGroup({
    bookByGenre: new FormControl('', {
      nonNullable: true,
    }),
  });

  protected applyFilter(): void {
    this.filterOutput.emit(this.filterForm.getRawValue().bookByGenre);
  }

  protected clearFilter(): void {
    this.filterForm.reset();
    this.filterOutput.emit('');
  }
}

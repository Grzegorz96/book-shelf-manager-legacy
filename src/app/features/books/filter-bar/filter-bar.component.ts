import { Component, output, input } from '@angular/core';
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
  protected readonly filterOutput = output<string>();
  protected readonly filterForm = new FormGroup({
    bookByGenre: new FormControl('', {
      nonNullable: true,
    }),
  });
  public readonly isDisabled = input.required<boolean>();

  protected applyFilter(): void {
    this.filterOutput.emit(this.filterForm.getRawValue().bookByGenre);
  }

  protected clearFilter(): void {
    this.filterForm.reset();
    this.filterOutput.emit('');
  }
}

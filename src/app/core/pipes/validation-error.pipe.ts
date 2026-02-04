import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validationError',
  standalone: true,
})
export class ValidationErrorPipe implements PipeTransform {
  transform(errorKey: string, errorValue: any): string {
    const errorMessages: { [key: string]: (value: any) => string } = {
      required: () => 'This field is required',
      email: () => 'Invalid email format',
      minlength: (val) =>
        `Minimum length: ${val.requiredLength} characters (provided: ${val.actualLength})`,
      maxlength: (val) => `Maximum length: ${val.requiredLength} characters`,
      pattern: () => 'Invalid format',
      min: (val) => `Minimum value: ${val.min}`,
      max: (val) => `Maximum value: ${val.max}`,
    };

    return errorMessages[errorKey] ? errorMessages[errorKey](errorValue) : `Error: ${errorKey}`;
  }
}

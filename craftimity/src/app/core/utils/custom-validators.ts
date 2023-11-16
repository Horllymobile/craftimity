import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static phoneNumberLenght(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }

      return control.value === 10 ? { length: true } : null;
    };
  }
  static matchingPasswords(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      return !compare(control.value.password, control.value.cmPassword)
        ? { notmatch: true }
        : null;
    };
  }
}

function compare(password: string, confirmPassword: string) {
  return password == confirmPassword;
}

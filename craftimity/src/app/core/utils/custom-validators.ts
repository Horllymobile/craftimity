import { AbstractControl } from '@angular/forms';

export class CustomValidators {
  static MatchingPasswords(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('cmPassword')?.value;
    const currentErrors = control.get('cmPassword')?.errors;
    const confirmControl = control.get('cmPassword');

    if (compare(password, confirmPassword)) {
      if (confirmControl) {
        confirmControl.setErrors({ ...currentErrors, not_matching: true });
      }
    } else {
      if (confirmControl && currentErrors) {
        confirmControl.setErrors(currentErrors);
      }
    }
  }
}

function compare(password: string, confirmPassword: string) {
  return password !== confirmPassword && confirmPassword !== '';
}

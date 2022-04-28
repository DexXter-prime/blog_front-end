import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { debounceTime, map, Observable } from "rxjs";
import { AuthService } from "./services/auth.service";

export class MyValidators {
  static checkConfirmPassword(originFieldToMatch: string, matchingControl: string): ValidatorFn {
    return (control: AbstractControl): null => {

      if (control.get(`${originFieldToMatch}`)?.value !== control.get(`${matchingControl}`)?.value) {
        control.get(`${matchingControl}`)?.setErrors({passwordConfirmation: true})
      }
      return null;
    }
  }

  static createValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      return authService.checkUsernameExists(control.value).pipe(debounceTime(3000), map((value) => value.isEmailExists ? {existingEmail: true}: null));
    }
  }

  static checkAmountOfTags(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: string} | any => {
      if(control.value) {
        let tags = control.value.replace(/\s/g, '').split(',')
        return tags.length > 5 ? {limitOftags: tags.length} : null
      }
      return null;
    }
  }
}

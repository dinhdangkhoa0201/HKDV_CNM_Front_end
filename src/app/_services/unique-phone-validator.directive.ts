import { Directive } from '@angular/core';
import {AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {uniqueEmailValidator} from './unique-email-validator.directive';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';


export function uniquePhoneValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return authService.isExistedPhone(control.value).pipe(
      map(result => {
        console.log('resutl validate unique phone  : ' + result);
        return result ? {uniquePhone: true} : null;
      })
    );
  };
}
@Directive({
  selector: '[uniquePhone]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UniquePhoneValidatorDirective, multi: true}]
})
export class UniquePhoneValidatorDirective implements AsyncValidator {

  constructor(private authService: AuthService) {
  }
  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return uniquePhoneValidator(this.authService)(control);
  }
}

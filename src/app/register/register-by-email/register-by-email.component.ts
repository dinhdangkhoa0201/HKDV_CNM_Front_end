import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register-by-email',
  templateUrl: './register-by-email.component.html',
  styleUrls: ['./register-by-email.component.css']
})
export class RegisterByEmailComponent implements OnInit {
  checkEmail: FormGroup;
  editable: boolean;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.checkEmail = this.formBuilder.group({
      email: new FormControl('',[Validators.required])
    });

    this.editable = false;
  }

  hasError(controlName, errorName, form): boolean {
    return form.controls[controlName].hasError(errorName);
  }

}

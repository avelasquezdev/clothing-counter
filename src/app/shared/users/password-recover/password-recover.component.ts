import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../shared/users/users.service';

@Component({
  selector: 'app-password-recover',
  templateUrl: './password-recover.component.html'
})
export class PasswordRecoverComponent implements OnInit {
  passForm: FormGroup;
  alert = {message: null, type: null};
  public message = '';
  public isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }
  createForm() {
    this.passForm = this.formBuilder.group({
      email: [ '', [
        Validators.required,
        Validators.email
      ]],
    });
  }

  showError(formValue) {
    return this.passForm.get(formValue).invalid && this.passForm.get(formValue).touched;
  }

  showErrors(formGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
    });
    return;
  }

  sendForgotPassword() {
    this.isLoading = true;
    if (this.passForm.invalid) {
      this.showErrors(this.passForm);
      return;
    }
    this.userService.forgotPassword({email: this.passForm.get('email').value}).subscribe(
      (response) => {
        this.isLoading = false;
        this.passForm.markAsPristine();

        this.alert.type = 1;
        this.alert.message = 'Te hemos enviado un correo para restablecer tu contraseña.';
      },
      (error) => {
        this.isLoading = false;
        this.passForm.markAsPristine();

        this.alert.type = 2;
        this.alert.message = 'No hemos podido enviarte el correo para restablecer contraseña.';
      });
  }

}

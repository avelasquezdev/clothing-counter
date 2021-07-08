import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {User} from '../../../shared/users/user.model';
import {UsersService} from '../../../shared/users/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  userResetPasswordForm: FormGroup;
  alert = {message: null, type: null};
  public message = '';
  public result = '';

  private id: any;
  private token: any;
  public isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public userService: UsersService
  ) {
    this.createForm();
  }

  createForm() {
    this.userResetPasswordForm = this.formBuilder.group({
      password:    ['', [
        Validators.required
      ]],
    });
  }

  reset(): void {
    if (!this.userResetPasswordForm.valid) {
      return;
    }

    const user = new User(
      {
        email: this.userResetPasswordForm.value.email,
        password: this.userResetPasswordForm.value.password
      }
    );

    this.isLoading = true;
    this.userService.resetPassword(user, this.token).subscribe(
      (response) => {
        this.isLoading = false;
        this.userResetPasswordForm.markAsPristine();

        this.alert.type = 1;
        this.alert.message = 'Se ha cambiado la contraseña con éxito. ' + '\n' +
          'En breve será redirigido.' ;
        this.result = 'success';

        setTimeout((router: Router) => {
          this.router.navigate(['']);
        }, 10000);

      },
      (error) => {
        this.isLoading = false;
        this.userResetPasswordForm.markAsPristine();

        this.alert.type = 2;
        this.alert.message = 'No se ha podido cambiar la contraseña. Por favor, reinicie el proceso de reseteo de contraseña.';
        this.result = 'error';
      });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
    });
  }
  showError(formValue) {
    return this.userResetPasswordForm.get(formValue).invalid && this.userResetPasswordForm.get(formValue).touched;
  }

  showErrors(formGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
    });
    return;
  }
}

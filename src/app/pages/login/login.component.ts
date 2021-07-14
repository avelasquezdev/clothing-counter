import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private authService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['',
        Validators.required
      ],
      password: ['',
        Validators.required
      ]
    })
  }

  login() {
    if (this.loginForm.invalid) {
      this.showErrors(this.loginForm);
    }

    const user = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    }

    this.authService.login(user.email, user.password)
    .then(() => {
      location.replace('');
    }).catch(error => {
      console.log(error.error.code + '- ' + error.error.message)
    });
  }

  showErrors(formGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
    });
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector( 'form .ng-invalid' );
    firstInvalidControl.focus();
    return;
  }
}

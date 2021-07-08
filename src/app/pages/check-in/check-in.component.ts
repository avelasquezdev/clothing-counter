import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  checkInForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private usersService: UsersService
  )
  {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.checkInForm = this.fb.group({
      email: ['',
        Validators.required
      ],
      username: ['',
        Validators.required
      ],
      password: ['',
        Validators.required
      ],
      roles: ['ROLE_USER',
        Validators.required
      ]
    })
  }

  checkIn() {
    if (this.checkInForm.invalid) {
      this.showErrors(this.checkInForm);
    }

    const user = {
      email: this.checkInForm.get('email').value,
      username: this.checkInForm.get('username').value,
      password: this.checkInForm.get('password').value,
      roles: this.checkInForm.get('roles').value
    }

    this.usersService.postUser(user).subscribe(() => {
      location.replace('');
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

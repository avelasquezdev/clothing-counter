import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/users/user.model';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  title = 'Nueva Usuario';
  user: User;
  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id) {
      this.title = 'Editar Usuario';
      this.editUser(this.activatedRoute.snapshot.params.id);
    }
  }

  createForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  editUser(id) {
    this.userService.getUser(id).subscribe((user: User) => {
      this.user = user;
      this.userForm.get('username').setValue(user['name']);
      this.userForm.get('email').setValue(user.email);
      this.userForm.get('password').setValue(user.password);
    })
  }

  setUser() {
    if (this.userForm.invalid) {
      this.showErrors(this.userForm)
    }

    const user = {
      username: this.userForm.get('username').value,
      email: this.userForm.get('email').value,
      password: this.userForm.get('password').value,
      roles: 'ROLE_USER'
    }

    if (this.user) {
      this.userService.putUser(this.user['@id'], user)
        .subscribe(() => {
          location.replace('/users-list');
        });
    } else {
      this.userService.postUser(user)
        .subscribe(() => {
          location.replace('/users-list');
        });
    }
  }

  showErrors(formGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).markAsTouched();
    });
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector('form .ng-invalid');
    firstInvalidControl.focus();
  }
}

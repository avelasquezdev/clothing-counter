import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user.model';
import { UserService } from '../user.service';

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
    private userService: UserService,
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
      name: ['', Validators.required]
    })
  }

  editUser(id) {
    this.userService.getUser(id).subscribe((user: User) => {
      this.user = user;
      this.userForm.get('email').setValue(user.email); // Pongo email o username?
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

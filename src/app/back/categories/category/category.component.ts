import { Component, ElementRef ,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup
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
    this.categoryForm = this.fb.group({
      categoryname: ['', Validators.required]
    })
  }

  category() {
    if (this.categoryForm.invalid) {
      this.showErrors(this.categoryForm)
    }

    const category = {
      categoryname: this.categoryForm.get('categoryname').value,
    }

    // No se que tendria que poner en vez de category
    this.authService.category(category.categoryname)
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
  }
}

import { Component, ElementRef ,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';

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
    private categoryService: CategoryService
  ) { 
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  category() {
    if (this.categoryForm.invalid) {
      this.showErrors(this.categoryForm)
    }

    const category = {
      name: this.categoryForm.get('name').value,
    }

    // No se que tendria que poner en vez de category
    this.categoryService.postCategory(category)
    .subscribe(() => {
      location.replace('');
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

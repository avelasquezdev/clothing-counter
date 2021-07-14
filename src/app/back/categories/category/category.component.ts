import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup;
  title = 'Nueva categoria';
  category: Category;
  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id) {
      this.title = 'Editar categoria';
      this.editCategory(this.activatedRoute.snapshot.params.id);
    }
  }

  createForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  editCategory(id) {
    this.categoryService.getCategory(id).subscribe((category: Category) => {
      this.category = category;
      this.categoryForm.get('name').setValue(category.name);
    })
  }

  setCategory() {
    if (this.categoryForm.invalid) {
      this.showErrors(this.categoryForm)
    }

    const category = {
      name: this.categoryForm.get('name').value,
    }

    if (this.category) {
      this.categoryService.putCategory(this.category['@id'], category)
        .subscribe(() => {
          location.replace('/categories-list');
        });
    } else {
      this.categoryService.postCategory(category)
        .subscribe(() => {
          location.replace('/categories-list');
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

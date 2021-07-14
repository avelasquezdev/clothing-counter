import { Component, ElementRef ,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClothingService } from '../clothing.service';

@Component({
  selector: 'app-category',
  templateUrl: './clothing.component.html',
  styleUrls: ['./clothing.component.css']
})
export class ClothingComponent implements OnInit {
  clothingForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private clothingService: ClothingService
  ) { 
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.clothingForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  clothing() {
    if (this.clothingForm.invalid) {
      this.showErrors(this.clothingForm)
    }

    const clothing = {
      name: this.clothingForm.get('name').value,
    }

    // No se que tendria que poner en vez de category
    this.clothingService.postClothing(clothing)
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

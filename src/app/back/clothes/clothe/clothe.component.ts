import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { CategoryService } from '../../categories/category.service';
import { ClotheService } from '../clothe.service';

@Component({
  selector: 'app-clothe',
  templateUrl: './clothe.component.html',
  styleUrls: ['./clothe.component.css']
})
export class ClotheComponent implements OnInit {
  clotheForm: FormGroup;
  categories;
  fileName = '';
  selectedFile: File;
  selectedFiles = [];
  uploadedFiles = [];
  image = null;
  uploadingProgressing = false;
  uploadComplete = false;
  serverResponse: any;
  uploadProgress = 0;
  fileToUpload: File = null;
  @ViewChild('labelUpload')
  labelUpload: ElementRef;

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private clotheService: ClotheService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories['hydra:member']
    })
  }

  createForm() {
    this.clotheForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['0', Validators.required],
      isRecommended: [false, Validators.required],
      categories: [null, Validators.required],
      createdBy: ['/users/' + this.authService.getUserId(), Validators.required],
      image: ['', Validators.required]
    })
  }

  CreateClothe() {
    if (this.clotheForm.invalid) {
      this.showErrors(this.clotheForm)
    }

    const clothe = {
      title: this.clotheForm.get('title').value,
      description: this.clotheForm.get('description').value,
      price: this.clotheForm.get('price').value,
      isRecommended: this.clotheForm.get('isRecommended').value,
      categories: [this.clotheForm.get('categories').value],
      image: this.clotheForm.get('image').value,
      createdBy: this.clotheForm.get('createdBy').value
    }

    // No se que tendria que poner en vez de category
    this.clotheService.postClothe(clothe)
      .subscribe(() => {
        location.replace('');
      });
  }

  onFileChanged(event) {
    if (event[ 0 ].type === 'image/jpeg' || event[ 0 ].type === 'image/png') {
      this.selectedFile = event[ 0 ];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        console.log(event);
        this.image = event.target.result;
      };

      reader.readAsDataURL(event[0]);
    }
  }

  onUpload() {
    this.clotheService.postMediaClothe(
      this.selectedFile).subscribe(result => {
      this.handleProgress(result);
    }, error => {
      console.log(error);
    });
  }

  handleProgress(event) {
    if (event.type === HttpEventType.DownloadProgress) {
      this.uploadingProgressing = true;
      this.uploadProgress = Math.round(100 * event.loaded / event.total);
    }

    if (event.type === HttpEventType.UploadProgress) {
      this.uploadingProgressing = true;
      this.uploadProgress = Math.round(100 * event.loaded / event.total);
    }

    if (event.type === HttpEventType.Response) {
      this.uploadComplete = true;
      this.uploadingProgressing = false;
      this.serverResponse = event.body;

      this.clotheForm.get('image').setValue(event.body['@id']);
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

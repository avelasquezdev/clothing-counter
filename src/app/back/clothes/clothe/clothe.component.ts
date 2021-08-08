import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { CategoryService } from '../../categories/category.service';
import { ClotheService } from '../clothe.service';
import { Clothe } from '../clothe.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clothe',
  templateUrl: './clothe.component.html',
  styleUrls: ['./clothe.component.css']
})
export class ClotheComponent implements OnInit {
  clotheForm: FormGroup;
  title = 'Nuevo artículo';
  clothe: Clothe;
  categories;
  fileName = '';
  selectedFile: File;
  selectedFiles = [];
  uploadedFiles = [];
  colors = ['Amarillos', 'Blancos', 'Azules', 'Negros', 'Verdes'];
  colorsSelected = [];
  sizes = ['XS', 'Small', 'M', 'L', 'XL', 'XXL'];
  sizesSelected = [];
  brands = ['Amazon', 'Kiabi', 'Shein', 'Aliexpress', 'Zalando'];
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
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories['hydra:member']
    })
    if (this.activatedRoute.snapshot.params.id) {
      this.title = 'Editar artículo';
      this.editClothe(this.activatedRoute.snapshot.params.id);
    }
  }

  createForm() {
    this.clotheForm = this.fb.group({
      title: ['', Validators.required],
      link: ['', Validators.required],
      description: ['', Validators.required],
      price: ['0', Validators.required],
      isRecommended: [false, Validators.required],
      isAvailable: [true, Validators.required],
      categories: [null, Validators.required],
      colors: [null, Validators.required],
      sizes: [null, Validators.required],
      brand: ['', Validators.required],
      createdBy: ['/users/' + this.authService.getUserId(), Validators.required],
      image: ['', Validators.required]
    })
  }

  editClothe(id) {
    this.clotheService.getClothe(id).subscribe((clothe: Clothe) => {
      this.clothe = clothe;
      this.clotheForm.get('title').setValue(clothe.title);
      this.clotheForm.get('link').setValue(clothe.link);
      this.clotheForm.get('description').setValue(clothe.description);
      this.clotheForm.get('price').setValue(clothe.price);
      this.clotheForm.get('isRecommended').setValue(clothe.isRecommended);
      this.clotheForm.get('isAvailable').setValue(clothe.isAvailable);
      this.clotheForm.get('categories').setValue(clothe.categories[0]['@id']);
      this.clotheForm.get('colors').setValue(clothe.colors[0]);
      this.clotheForm.get('sizes').setValue(clothe.sizes[0]);
      this.sizesSelected = this.clotheForm.get('sizes').value;
      this.colorsSelected = this.clotheForm.get('colors').value;
      this.clotheForm.get('brand').setValue(clothe.brand);
      this.clotheForm.get('image').setValue(clothe.image['@id']);
      this.image = 'http://localhost:8000/media/'+clothe.image['filePath'];
    })
  }

  setClothe() {
    if (this.clotheForm.invalid) {
      this.showErrors(this.clotheForm)
    }

    const clothe = {
      title: this.clotheForm.get('title').value,
      link: this.clotheForm.get('link').value,
      description: this.clotheForm.get('description').value,
      price: this.clotheForm.get('price').value,
      isRecommended: this.clotheForm.get('isRecommended').value,
      isAvailable: this.clotheForm.get('isAvailable').value,
      categories: [this.clotheForm.get('categories').value],
      colors: [this.clotheForm.get('colors').value],
      sizes: [this.clotheForm.get('sizes').value],
      brand: this.clotheForm.get('brand').value,
      image: this.clotheForm.get('image').value,
      createdBy: this.clotheForm.get('createdBy').value
    }

    if (this.clothe) {
      this.clotheService.putClothe(this.clothe['@id'], clothe)
        .subscribe(() => {
          location.replace('/clothes-list');
        });
    } else {
      this.clotheService.postClothe(clothe)
        .subscribe(() => {
          location.replace('');
        });
    }
  }

  onFileChanged(event) {
    if (event[0].type === 'image/jpeg' || event[0].type === 'image/png') {
      this.selectedFile = event[0];
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

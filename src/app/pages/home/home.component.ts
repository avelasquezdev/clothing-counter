import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ClotheService } from 'src/app/back/clothes/clothe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  filtersForm: FormGroup;
  modalRef: BsModalRef;
  clothes;
  colors = ['Amarillo', 'Blanco', 'Azul', 'Negro', 'Verde'];
  colorsSelected = [];
  popularitySelected = [];
  prices = ['10', '20', '30', '40', '50'];
  pricesSelected = null;
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  sizesSelected = [];
  brands = ['Amazon', 'Kiabi', 'Shein', 'Aliexpress', 'Zalando'];
  brandsSelected = [];
  dynamic = 0;
  type: 'success' | 'info' | 'warning' | 'danger';
  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private clotheService: ClotheService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.clotheService.getClothes().subscribe(clothes => {
      this.clothes = clothes['hydra:member'];
    })
    setTimeout(() => {
      this.onChanges();
    }, 1000);
  }

  onChanges(): void {
    this.filtersForm.valueChanges.subscribe(() => {
      this.clotheService.getClothes(this.filtersForm.value).subscribe(clothes => {
        this.clothes = clothes['hydra:member'];
      })
    });
  }

  createForm() {
    this.filtersForm = this.formBuilder.group({
      isTrending: [false],
      isFashion: [false],
      isGood: [false],
      isOk: [false],
      isHats: [false],
      isShirts: [false],
      isHodies: [false],
      isJackets: [false],
      isPants: [false],
      isShoes: [false],
      colors: [''],
      price: [''],
      sizes: [''],
      brands: [''],
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  addImpact(clotheId) {
    this.clotheService.addImpact(clotheId).subscribe(() => {
      this.clotheService.getClothes().subscribe(clothes => {
        this.clothes = clothes['hydra:member'];
      })
    })
  }

  getType(value) {
    let type;
    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    this.type = type;
  }

  getValue(value) {
    return value;
    /* while(i<value) {
      i++;
      console.log(i);
      setTimeout(() => {
        this.getValue(i, value);
      }, 1000);
      return i;
    } */
  }
}

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
    this.filtersForm.valueChanges.subscribe( () => {
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
}

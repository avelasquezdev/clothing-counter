import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ClotheService } from 'src/app/back/clothes/clothe.service';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
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
  animation = false;
  type: 'success' | 'info' | 'warning' | 'danger';
  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private clotheService: ClotheService,
    private authService: AuthService
  ) {
    // this.createForm();
  }

  ngOnInit(): void {
    this.clotheService.getClothesByUserId(this.authService.getProfileId()).subscribe(clothes => {
      this.clothes = clothes['hydra:member'];
      setTimeout(() => {
        this.animation = true;
      }, 500);
    })
    setTimeout(() => {
      this.onChanges();
    }, 1000);
  }

  onChanges(): void {

  }

  // filterClothes() {
  //   this.animation = false;
  //   this.clotheService.getClothesByUserId(this.authService.getProfileId()).subscribe(clothes => {
  //     this.clothes = clothes['hydra:member'];
  //     setTimeout(() => {
  //       this.animation = true;
  //     }, 500);
  //   });
  // }

  // createForm() {
  //   this.filtersForm = this.formBuilder.group({
  //     isTrending: [false],
  //     isFashion: [false],
  //     isGood: [false],
  //     isOk: [false],
  //     isHats: [false],
  //     isShirts: [false],
  //     isHodies: [false],
  //     isJackets: [false],
  //     isPants: [false],
  //     isShoes: [false],
  //     colors: [''],
  //     price: [''],
  //     sizes: [''],
  //     brands: [''],
  //   })
  // }

  // openModal(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template);
  // }

  addImpact(clotheId) {
    this.clotheService.addImpact(clotheId).subscribe(() => {
      this.clotheService.getClothes(this.filtersForm.value).subscribe(clothes => {
        this.clothes = clothes['hydra:member'];
      })
    })
  }

  getType(value) {
    let type;
    if (value < 25) {
      type = 'primary';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    return type;
  }
}

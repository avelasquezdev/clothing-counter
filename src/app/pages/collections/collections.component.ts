import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ClotheService } from 'src/app/back/clothes/clothe.service';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UsersService } from 'src/app/shared/users/users.service';
import { User } from 'src/app/shared/users/user.model';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/back/categories/category.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  filtersForm: FormGroup;
  modalRef: BsModalRef;
  clothes;
  colors = ['Amarillos', 'Azules', 'Beiges', 'Blancos', 'Estampados', 'Grises', 'Marrones', 'Morados', 'Multicolores', 'Naranjas', 'Negros', 'Plateados', 'Rojos', 'Rosas', 'Turquesas', 'Verdes'];
  colorsSelected = [];
  popularitySelected = [];
  orders = [{name: 'Popularidad', value: 'popularity', order: 'asc'}, {name: 'Precio ascendente', value: 'price', order: 'asc'}, {name: 'Precio descendente', value: 'price', order: 'desc'},
  {name: 'Fecha ascendente', value: 'createdAt', order: 'asc'}, {name: 'Fecha descendente', value: 'createdAt', order: 'desc'}];
  //'Agosto', 'Julio', 'Junio', 'Mayo', 'Abril', 'Marzo', 'Febrero', 'Enero', '2020'];
  orderSelected = null;
  sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '52', '50', '48', '46', '44', '42', '40', '38', '36', '34'];
  sizesSelected = [];
  brands = ['Aliexpress', 'Amazon', 'Kiabi', 'Shein', 'Wish', 'Zaful', 'Zalando'];
  brandsSelected = [];
  dynamic = 0;
  animation = false;
  type: 'success' | 'info' | 'warning' | 'danger';
  userClothes = [];
  isAlertShown = false;
  categories;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private clotheService: ClotheService,
    private authService: AuthService,
    private userServices: UsersService,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    this.createForm();
  }

  ngOnInit(): void {

    if (this.activatedRoute.snapshot.params.category) {
      this.filtersForm.get(this.activatedRoute.snapshot.params.category).setValue(true);
    }
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories['hydra:member'];
    })
    this.clotheService.getClothes(this.filtersForm.value).subscribe(clothes => {
      this.clothes = clothes['hydra:member'];
      if (this.authService.getUserId()) {
        this.clotheService.getClothesByUserId(this.authService.getProfileId()).subscribe(clothes => {
          this.userClothes = Array.from(clothes['hydra:member']).map((item) => item['@id']);
        });
      }
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

  filterClothes() {
    this.animation = false;
    this.clotheService.getClothes(this.filtersForm.value).subscribe(clothes => {
      this.clothes = clothes['hydra:member'];
      setTimeout(() => {
        this.animation = true;
      }, 500);
    });
  }

  createForm() {
    this.filtersForm = this.formBuilder.group({
      accesorios: [false],
      bañadores: [false],
      bermudas: [false],
      bolsos: [false],
      camisas: [false],
      camisetas: [false],
      cazadoras: [false],
      chaquetas: [false],
      gorras: [false],
      jeans: [false],
      jerseis: [false],
      joggers: [false],
      pantalones: [false],
      polos: [false],
      sudaderas: [false],
      zapatos: [false],
      order: ['']
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

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

  clickFavorite(clotheId) {
    if (this.authService.getUserId()) {
      this.userClothes.includes(clotheId) ?
        this.userClothes.splice(this.userClothes.indexOf(clotheId), 1) : this.userClothes.push(clotheId);
      const userProfile = {
        favs: this.userClothes
      };
      this.userServices.putUserProfile('/user_profiles/' + this.authService.getProfileId(), userProfile).subscribe();
    } else {
      location.replace('check-in');
    }
  }
}

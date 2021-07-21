import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Clothe } from 'src/app/back/clothes/clothe.model';
import { ClotheService } from 'src/app/back/clothes/clothe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  modalRef: BsModalRef;
  clothes;
  constructor(
    private modalService: BsModalService,
    private clotheService: ClotheService
  ) { }

  ngOnInit(): void {
    this.clotheService.getClothes().subscribe(clothes => {
      this.clothes = clothes['hydra:member'];
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

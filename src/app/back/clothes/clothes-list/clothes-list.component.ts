import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ClotheService } from '../clothe.service';

@Component({
  selector: 'app-clothes-list',
  templateUrl: './clothes-list.component.html',
  styleUrls: ['./clothes-list.component.css']
})
export class ClothesListComponent implements OnInit {
  columns = [];
  rows = [];
  searchForm: FormGroup;
  alert = { message: null, type: null };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  dialogRef: BsModalRef;

  constructor(
    private clothesService: ClotheService,
    private searchFormBuilder: FormBuilder,
    public dialog: BsModalService,
  ) {
    this.clothesService.getClothes().subscribe((clothes => {
      this.rows = clothes['hydra:member'];
    }));
  }

  ngOnInit(): void {
    this.searchForm = this.searchFormBuilder.group({
      title: [''],
      description: [''],
      price: [''],
      popularity: [''],
      impacts: [],
      isRecommended: []
    });
    this.columns = [
      { prop: 'title', name: 'Título' },
      { prop: 'description', name: 'Descripción' },
      { prop: 'price', name: 'Precio' },
      { prop: 'popularity', name: 'Popularidad' },
      { prop: 'impacts', name: 'Impactos' },
      { prop: 'isRecommended', name: 'Recomendado' },
    ];
  }

  applyFilter() {
    this.clothesService.getClothes(this.searchForm.value).subscribe(
      data => {
        this.rows = data['hydra:member'];
        this.table.offset = 0;
      }
    );
  }

  deleteClothe(clotheId) {

    this.clothesService.deleteClothe(clotheId).subscribe(
      (result) => {
        this.alert.type = 1;
        this.alert.message = 'Ropa eliminada correctamente';
        setTimeout(() => {
          this.alert = { message: null, type: null };
        }, 5000);
      },
      error => {
        this.alert.message = error.error.code + '- ' + error.error.message;
        this.alert.type = 2;
        setTimeout(() => {
          this.alert = { message: null, type: null };
        }, 5000);
      },
    );
    setTimeout(() => {
      this.clothesService.getClothes().subscribe((clothes => {
        this.rows = clothes['hydra:member'];
        this.table.offset = 0;
      }));
    }, 2000);
  }
}

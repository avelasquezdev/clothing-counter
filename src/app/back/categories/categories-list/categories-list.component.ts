import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  columns = [];
  rows = [];
  searchForm: FormGroup;
  alert = { message: null, type: null };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  dialogRef: BsModalRef;

  constructor(
    private categoriesService: CategoryService,
    private searchFormBuilder: FormBuilder,
    public dialog: BsModalService,
  ) {
    this.categoriesService.getCategories().subscribe((categories => {
      this.rows = categories['hydra:member'];
    }));
  }

  ngOnInit(): void {
    this.searchForm = this.searchFormBuilder.group({
      name: ['']
    });
    this.columns = [
      { prop: 'name', name: 'Nombre' }];
  }

  applyFilter() {
    this.categoriesService.getCategories(this.searchForm.value).subscribe(
      data => {
        this.rows = data['hydra:member'];
        this.table.offset = 0;
      }
    );
  }

  deleteCategory(categoryId) {

    this.categoriesService.deleteCategory(categoryId).subscribe(
      (result) => {
        this.alert.type = 1;
        this.alert.message = 'Categoria eliminada correctamente';
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
      this.categoriesService.getCategories().subscribe((categories => {
        this.rows = categories['hydra:member'];
        this.table.offset = 0;
      }));
    }, 2000);
  }
}

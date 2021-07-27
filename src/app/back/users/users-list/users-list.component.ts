import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UsersService } from '../../../shared/users/users.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  columns = [];
  rows = [];
  searchForm: FormGroup;
  alert = { message: null, type: null };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  dialogRef: BsModalRef;

  constructor(
    private usersService: UsersService,
    private searchFormBuilder: FormBuilder,
    public dialog: BsModalService,
  ) {
    this.usersService.getUsers().subscribe((categories => {
      this.rows = categories['hydra:member'];
    }));
  }

  ngOnInit(): void {
    this.searchForm = this.searchFormBuilder.group({
      email: [''],
      roles: [],//como puedo buscar que poner en caso de que sea JSON?
      //password: [''],
      username: ['']
    });
    this.columns = [
      { prop: 'email', name: 'Correo Electronico' },
      { prop: 'roles', name: 'Roles' },
      //{ prop: 'password', name: 'Contraseña' },
      { prop: 'username', name: 'Nombre de Usuario' },
    ];
  }

  applyFilter() {
    this.usersService.getUsers(this.searchForm.value).subscribe(
      data => {
        this.rows = data['hydra:member'];
        this.table.offset = 0;
      }
    );
  }

  deleteUser(userId) {

    this.usersService.deleteUser(userId).subscribe(
      (result) => {
        this.alert.type = 1;
        this.alert.message = 'Usuario eliminado correctamente';
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
      this.usersService.getUsers().subscribe((categories => {
        this.rows = categories['hydra:member'];
        this.table.offset = 0;
      }));
    }, 2000);
  }
}

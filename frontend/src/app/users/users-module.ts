import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersList } from './users-list/users-list';
import { UserModal } from './user-modal/user-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UsersList,
    UserModal
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    UsersList 
  ]
})
export class UsersModule { }

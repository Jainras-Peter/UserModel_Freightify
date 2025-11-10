import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersList } from './users-list/users-list';
import { UserModal } from './user-modal/user-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from '../message/message-module';



@NgModule({
  declarations: [
    UsersList,
    UserModal
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MessageModule
  ],
  exports: [
    UsersList 
  ]
})
export class UsersModule { }

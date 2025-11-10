import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessAlertComponent } from './success-alert/success-alert';
import { DeleteConfirmModal} from './delete-confirm-modal/delete-confirm-modal';



@NgModule({
  declarations: [
    SuccessAlertComponent,
    DeleteConfirmModal
  ],
  imports: [
    CommonModule
  ],exports: [
    SuccessAlertComponent,
    DeleteConfirmModal
  ]
})
export class MessageModule { }

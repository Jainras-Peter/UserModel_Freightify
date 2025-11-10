import { Component, Output, EventEmitter, Input } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: false,
  templateUrl: './delete-confirm-modal.html',
  styleUrls: ['./delete-confirm-modal.css']
})
export class DeleteConfirmModal{
  @Input() show = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  confirmDelete() {
    this.confirm.emit();
  }

  cancelDelete() {
    this.cancel.emit();
  }
}

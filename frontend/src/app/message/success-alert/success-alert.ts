import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-success-alert',
  standalone: false,
  templateUrl: './success-alert.html',
  styleUrls: ['./success-alert.css']
})
export class SuccessAlertComponent {
  @Input() message = '';
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();

  closeAlert() {
    this.closed.emit();
  }
}

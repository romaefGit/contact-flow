import { Component, Input, ViewChild } from '@angular/core';
import { BaseModalComponent } from '../base-modal.component';

@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [BaseModalComponent],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.scss',
})
export class MessageModalComponent {
  @Input() type: 'warning' | 'info' | 'error' | 'success' = 'info';
  @Input() iconName: string = 'fa-info-circle';
  @Input() message: string = '';

  @ViewChild('dialog') dialog!: BaseModalComponent;

  /**
   * Opens the modal dialog and resets the form.
   * This method is typically called when the user initiates a create or update action.
   */
  openDialog() {
    this.dialog.openDialog();
  }

  /**
   * Closes the modal dialog and resets the form.
   * This method is typically called when the user cancels an action.
   */
  closeDialog() {
    this.dialog.closeDialog();
  }
}

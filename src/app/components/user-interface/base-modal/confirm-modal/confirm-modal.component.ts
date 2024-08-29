import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { BaseModalComponent } from '../base-modal.component';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [BaseModalComponent, ButtonComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  @Output() onConfirm = new EventEmitter<void>();
  @Input() header = 'Confirmation dialog';
  @Input() description = 'Are you sure you want to perform this action?';
  @Input() acceptText = 'Yes';
  @Input() cancelText = 'No';

  @Input() showCloseButton: boolean = true;

  @Input() acceptButton: any = {
    theme: 'primary',
    size: 'sm',
    buttonClass: 'w-full',
  };
  @Input() cancelButton: any = {
    theme: 'danger',
    size: 'sm',
    buttonClass: 'w-full',
  };

  @Input() loading = false;

  constructor() {}

  @ViewChild('dialog') dialog!: BaseModalComponent;
  @Input() errorMessage!: string;

  openDialog(config?: {
    title?: string;
    description?: string;
    acceptText?: string;
    cancelText?: string;
    maxWidth?: string;
    showCloseButton?: boolean;
  }) {
    if (config?.title) this.header = config.title;
    if (config?.description) this.description = config.description;
    if (config?.acceptText) this.acceptText = config.acceptText;
    if (config?.cancelText) this.cancelText = config.cancelText;
    if (config?.showCloseButton) this.showCloseButton = config.showCloseButton;

    this.dialog.openDialog();
    this.errorMessage = '';
  }

  closeDialog() {
    this.dialog.closeDialog();
    this.errorMessage = '';
    this.loading = false;
  }

  onAccept() {
    if (this.loading) {
      // console.log("can't run this while it's loading")
      return;
    }
    this.closeDialog();
    this.onConfirm.emit();
  }
}

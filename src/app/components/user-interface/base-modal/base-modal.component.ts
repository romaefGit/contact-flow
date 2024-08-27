import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  Component,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ClickListenerService } from '../../../app.component';
import { CommonModule } from '@angular/common';
const timeAnimation = 200; //  milliseconds
@Component({
  selector: 'app-base-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-modal.component.html',
  styleUrl: './base-modal.component.scss',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          top: -16,
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          top: 0,
        }),
      ),
      transition('open => closed', [animate(timeAnimation + 'ms')]),
      transition('closed => open', [animate(timeAnimation + 'ms')]),
    ]),
  ],
})
export class BaseModalComponent {
  @Input() header = '';
  @Input() styled = true;

  @Input() showCloseButton = true;
  @Input() titleModal = '';
  @Input() bgPersonalized = '';
  @Output() isClosed = new EventEmitter<any>();

  /**Passes as reference
   * @param baseDialog
   * @param dialogContent
   */
  @ViewChild('baseDialog') dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('dialogContent') dialogContent!: ElementRef<HTMLDialogElement>;

  /**This component is the modal base for others modals, it gives the basic funciontality such as closed, the button, title */

  isOpen = false;
  private subscription!: Subscription;
  private prematurelyClosed = false;

  constructor(private clickListenerService: ClickListenerService) {}

  documentClickListener(target: any): void {
    if (
      this.dialog.nativeElement.open &&
      this.dialog.nativeElement.isEqualNode(target as HTMLElement)
    ) {
      this.closeDialog();
    }
  }

  ngOnInit(): void {
    this.subscription =
      this.clickListenerService.documentClickedTarget.subscribe((target) =>
        this.documentClickListener(target),
      );
  }
  ngAfterViewInit() {
    this.dialog.nativeElement.addEventListener('cancel', this.onCancel);
    this.dialog.nativeElement.addEventListener('close', this.onClose);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      if (this.dialog) {
        this.dialog.nativeElement.removeEventListener('cancel', this.onCancel);
        this.dialog.nativeElement.removeEventListener('close', this.onClose);
      }
    }
  }

  openDialog() {
    this.dialog.nativeElement.showModal();
    this.isOpen = true;
  }

  closeDialog() {
    this.isOpen = false;
    setTimeout(() => {
      //Wait for the close animation to end before closing the <dialog>
      this.isClosed.emit();
      this.dialog.nativeElement.close();
    }, timeAnimation);
  }

  private onCancel = (e: Event) => {
    this.isClosed.emit();

    if (e.target !== this.dialog.nativeElement) {
      this.prematurelyClosed = true;
    }
  };

  private onClose = (e: Event) => {
    if (this.prematurelyClosed) {
      //This is a workaround for a bug in chrome where the dialog closes after cancelling a file upload https://bugs.chromium.org/p/chromium/issues/detail?id=1442824
      this.prematurelyClosed = false;
      setTimeout(() => {
        this.dialog.nativeElement.showModal();
      }, 0);
    }
  };
}

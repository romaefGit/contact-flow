import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-message',
  standalone: true,
  imports: [],
  templateUrl: './info-message.component.html',
  styleUrl: './info-message.component.scss',
})
export class InfoMessageComponent {
  @Input({ required: true }) message: any = '';
  @Input({ required: true }) iconName: string = '';
  @Input() iconClass: string = 'error';
}

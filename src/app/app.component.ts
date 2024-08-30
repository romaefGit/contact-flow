import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { MessageModalComponent } from './components/user-interface/base-modal/message-modal/message-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, MessageModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'contact-crud';
}
@Injectable({ providedIn: 'root' })
export class ClickListenerService {
  documentClickedTarget: Subject<HTMLElement> = new Subject<HTMLElement>();
}

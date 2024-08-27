import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { ContactsService } from '../../../core/services/contacts/contacts.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  @Input({ alias: 'id' }) contactId!: string;

  private readonly contactsService = inject(ContactsService);
  contactDetail$: Observable<any> = this.contactsService.getContactById(
    this.contactId,
  );

  ngOnInit(): void {
    this.getContactDetail();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getContactDetail();
  }

  getContactDetail() {
    this.contactDetail$ = this.contactsService.getContactById(this.contactId);
  }
}

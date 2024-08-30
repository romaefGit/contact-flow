import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { Type, Types } from '../../../core/models/types.model';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent implements OnChanges, AfterViewInit {
  isDropdownOpen = false;
  selectedOptionIndex: number = 0;
  selectedOption: any;

  @Input({ required: true }) options: Type[] = [];
  @Input() autoSelectOption!: Type;
  @Output() selected = new EventEmitter<any>();

  ngAfterViewInit(): void {
    // Initial selection after view initialization
    this.selectFirstOptionIfAvailable();
    if (this.autoSelectOption && this.options)
      this.autoSelect(this.autoSelectOption);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      // Handle the case where options are populated or updated
      this.selectFirstOptionIfAvailable();
      if (this.autoSelectOption && this.options)
        this.autoSelect(this.autoSelectOption);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: Type) {
    this.selectedOption = option;
    this.selected.emit(option);
    this.isDropdownOpen = false;
  }

  autoSelect(option: Type) {
    let indexArrayOption = this.options.findIndex((opt) => opt.id == option.id);
    if (indexArrayOption !== -1) {
      this.selectedOption = this.options[indexArrayOption];
    }
    this.isDropdownOpen = false;
  }

  private selectFirstOptionIfAvailable() {
    if (this.options.length > 0) {
      this.selectOption(this.options[this.selectedOptionIndex]);
    }
  }
}

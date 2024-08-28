import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input({ required: true }) label = 'Button';
  @Input() customWidth = '';
  @Input() buttonClass = '';
  @Input() icon = '';
  @Input() iconColor = '#fff';
  @Input() iconName = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() disabled = false;
  @Input() theme: ButtonTheme = 'primary';
  @Input() size!: 'xs' | 'sm' | 'md' | 'lg';

  @Output() action = new EventEmitter<void>();
  @Output() hovered = new EventEmitter<boolean>();

  hoverActive = false;

  /**
   * sets up the twClasses property of the component by combining the base button classes,
   *  any additional classes, and the classes specific to the button theme determined by the theme parameter
   */
  ngOnInit() {}

  /**
   *
   * @param state
   */
  hover(state: boolean) {
    this.hoverActive = !this.hoverActive;
    this.hovered.emit(this.hoverActive);
  }
}

export type ButtonTheme = 'primary' | 'secondary' | 'tertiary';

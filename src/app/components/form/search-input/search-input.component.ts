import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  searchTerm = '';
  @Output() action = new EventEmitter<any>();

  /**
   * The handleSearch method is a function used to handle search functionality of adventures or universes
   * It sets the searchTerm property of the component to the value entered in the search input.
   * @param e
   */
  handleSearch(e: any): void {
    // this._loading.showLoading(true);
    // console.log('e > ', e.target.value);
    this.searchTerm = e.target.value;

    this.action.emit(e.target.value);
  }

  search() {
    this.action.emit(this.searchTerm);
  }
}

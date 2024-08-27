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
  @Input() data: any[] = [];
  @Input() nameOfField = ''; // the name of the field to search
  @Input() nameOfSubField = ''; // the name of the field to search
  @Input() searchTerm = '';
  @Input() withDelay = false;

  @Output() filteredItems = new EventEmitter<any>();
  @Output() termSearched = new EventEmitter<any>();

  initialItems: any[] = [];
  initialTermsSetIt!: boolean;
  timeout = null;

  constructor() {}

  /**
   *  this method is used to track changes to the cards input property and update
   * the initialItems array accordingly to keep track of the initial items and any subsequent additions to the cards array.
   * @param changes
   */
  ngOnChanges(changes: any) {
    if (changes.cards && changes.cards.currentValue) {
      // const updatedCards = changes.cards.currentValue;
      if (this.data) {
        if (!this.initialTermsSetIt) {
          this.initialItems = this.data;
          this.initialTermsSetIt = true;
        }
        if (
          this.initialTermsSetIt &&
          this.data.length > this.initialItems.length
        ) {
          this.initialItems = this.data;
        }
      }
    }
  }

  /**
   * The handleSearch method is a function used to handle search functionality of adventures or universes
   * It sets the searchTerm property of the component to the value entered in the search input.
   * @param e
   */
  handleSearch(e: any): void {
    // this._loading.showLoading(true);
    // console.log("e > ", e.target.value)
    this.searchTerm = e.target.value;
    let filtered: any = [];
    // Filter cards based on search term
    if (this.nameOfSubField == '') {
      filtered = this.data.filter((card) =>
        card[this.nameOfField]
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase()),
      );
    } else {
      filtered = this.data.filter((card) =>
        card[this.nameOfField]?.[this.nameOfSubField]
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase()),
      );
    }

    if (this.searchTerm == '') filtered = this.initialItems;
    // console.log("filtered > ", filtered);

    if (!this.withDelay) {
      this.filteredItems.emit(filtered);
      this.termSearched.emit(this.searchTerm);
    } else {
      // Clear the timeout if it has already been set.
      // This will prevent the previous task from executing
      // if it has been less than <MILLISECONDS>
      let _self = this;
      // Make a new timeout set to go off in 1000ms (1 second)
      setTimeout(function () {
        _self.filteredItems.emit(filtered);
        _self.termSearched.emit(_self.searchTerm);
      }, 500);
    }
  }
}

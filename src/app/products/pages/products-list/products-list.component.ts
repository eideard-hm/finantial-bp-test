import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';

import { NavigationService } from '@services';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export default class ProductsListComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _navigationService = inject(NavigationService);

  protected searchControl = this._fb.control('');

  ngOnInit(): void {
    this.listenToSearchControlChanges();
  }

  private listenToSearchControlChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(value => !!value),
        map(value => value?.trim().toLocaleLowerCase() ?? '')
      )
      .subscribe(searchValue => {
        console.log(searchValue);
      });
  }

  protected handleNewProduct() {
    this._navigationService.navigateTo(['new-product']);
  }
}
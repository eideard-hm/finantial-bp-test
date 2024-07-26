import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';

import { NavigationService } from '@services';
import { DropdownComponent, PaginationComponent } from '@shared/components';
import { ProductConsts } from '@shared/consts';
import type { IDropdownOption } from '@shared/models';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DropdownComponent, PaginationComponent],
})
export default class ProductsListComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _navigationService = inject(NavigationService);

  protected searchControl = this._fb.control('');
  protected dataSource = signal<unknown[]>([]);
  protected readonly dropdownOptions = signal<IDropdownOption[]>([
    { label: 'New Product', value: 'new-product' },
  ]);

  ngOnInit(): void {
    this.listenToSearchControlChanges();
  }

  private listenToSearchControlChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(ProductConsts.SEARCH_DEBOUNCE_TIME),
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

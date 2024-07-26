import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';

import type { IFinancialData } from '@products/models';
import { FinancialService } from '@products/services/financial.service';
import { NavigationService } from '@services';
import {
  ButtonComponent,
  DropdownComponent,
  PaginationComponent,
} from '@shared/components';
import { ProductConsts } from '@shared/consts';
import type { IDropdownOption } from '@shared/models';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    DropdownComponent,
    PaginationComponent,
    ButtonComponent,
  ],
})
export default class ProductsListComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _navigationService = inject(NavigationService);
  private readonly _financialSvc = inject(FinancialService);

  protected searchControl = this._fb.control('');
  protected dataSource = signal<IFinancialData[]>([]);
  protected readonly dropdownOptions = signal<IDropdownOption[]>([
    { label: 'New Product', value: 'new-product' },
  ]);

  ngOnInit(): void {
    this.retrieveProducts();
    this.listenToSearchControlChanges();
  }

  private retrieveProducts(): void {
    this._financialSvc
      .retrieveFinancialData()
      .subscribe(products => this.dataSource.set(products));
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

import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import type { IFinancialData } from '@products/models';
import { FinancialService } from '@products/services/financial.service';
import { NavigationService } from '@services';
import {
  ButtonComponent,
  DropdownComponent,
  PaginationComponent,
} from '@shared/components';
import { ProductConsts } from '@shared/consts';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    TitleCasePipe,
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
  private dataSourceBackup: IFinancialData[] = [];

  protected elementsPerPage = ProductConsts.DEFAULT_ELEMENTS_PER_PAGE;
  protected searchControl = this._fb.control('');
  protected dataSource = signal<IFinancialData[]>([]);

  ngOnInit(): void {
    this.retrieveProducts();
    this.listenToSearchControlChanges();
  }

  private retrieveProducts(): void {
    this._financialSvc.retrieveFinancialData().subscribe(products => {
      this.dataSourceBackup = products;
      this.dataSource.set(products.slice(0, this.elementsPerPage));
    });
  }

  private listenToSearchControlChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(ProductConsts.SEARCH_DEBOUNCE_TIME),
        distinctUntilChanged(),
        map(value => value?.trim().toLocaleLowerCase() ?? '')
      )
      .subscribe(searchValue => this.filterBySearchValue(searchValue));
  }

  private filterBySearchValue(searchValue: string): void {
    const filteredProducts = this.dataSourceBackup.filter(
      product =>
        product.name.toLocaleLowerCase().includes(searchValue) ||
        product.description.toLocaleLowerCase().includes(searchValue)
    );

    const sliceProducts = filteredProducts.slice(0, this.elementsPerPage);
    this.dataSource.set(sliceProducts);
  }

  protected handleNewProduct() {
    this._navigationService.navigateTo(['new-product']);
  }

  protected buildEditUrl(id: string): string {
    return `edit-product/${id}`;
  }

  protected getDate(date: string): Date {
    const [dateValue] = date.split('T');
    const [year, month, day] = dateValue.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  protected handleElementsPerPageChage(value: number): void {
    this.elementsPerPage = value;
    this.dataSource.set(this.dataSourceBackup.slice(0, value));
  }
}

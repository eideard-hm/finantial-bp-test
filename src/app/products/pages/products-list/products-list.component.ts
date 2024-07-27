import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs';

import type { IFinancialData } from '@products/models';
import { FinancialService } from '@products/services/financial.service';
import { ModalService, NavigationService } from '@services';
import {
  ButtonComponent,
  DropdownComponent,
  ModalComponent,
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
    TitleCasePipe,
    ReactiveFormsModule,
    DropdownComponent,
    PaginationComponent,
    ButtonComponent,
    ModalComponent,
  ],
})
export default class ProductsListComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _navigationService = inject(NavigationService);
  private readonly _financialSvc = inject(FinancialService);
  private readonly _modalSvc = inject(ModalService);

  private dataSourceBackup: IFinancialData[] = [];
  private _modalInfoMessage = `¿ Esta seguro/a de eliminar el producto:`;

  protected isOpenModal = signal(false);
  protected elementsPerPage = ProductConsts.DEFAULT_ELEMENTS_PER_PAGE;
  protected searchControl = this._fb.control('');
  protected dataSource = signal<IFinancialData[]>([]);
  protected modalInfo = signal({
    title: `Eliminar Producto Financiero`,
    message: this._modalInfoMessage,
  });

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

  protected getDate(date: string): Date {
    const [dateValue] = date.split('T');
    const [year, month, day] = dateValue.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  protected handleElementsPerPageChage(value: number): void {
    this.elementsPerPage = value;
    this.dataSource.set(this.dataSourceBackup.slice(0, value));
  }

  private handleDeleteProduct(id: string): void {
    this.modalInfo.update(prev => ({
      ...prev,
      message: `${prev.message} ${id} ?`,
    }));
    this.isOpenModal.set(true);

    this._modalSvc.confirmation$.subscribe(isConfirmed => {
      if (!isConfirmed) return;

      this._financialSvc
        .deleteProduct(id)
        .pipe(
          tap(() =>
            this.modalInfo.update(prev => ({
              ...prev,
              message: this._modalInfoMessage,
            }))
          )
        )
        .subscribe(message => message && this.retrieveProducts());
    });
  }

  protected buildDropdownOptions(productId: string): IDropdownOption[] {
    return [
      {
        label: 'Editar Producto',
        value: `edit-product/${productId}`,
      },
      {
        label: 'Eliminar Producto',
        callback: () => this.handleDeleteProduct(productId),
      },
    ];
  }
}

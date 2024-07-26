import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { ProductConsts } from '@shared/consts';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  dataSourceLen = input.required<number>();

  // outputs
  elementPerPageChange = output<number>();

  protected readonly elementsPerPage = ProductConsts.ELEMENTS_PER_PAGE;

  protected handlePaginationPerPageChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const elementsPerPage = Number(target.value);

    this.elementPerPageChange.emit(elementsPerPage);
  }
}

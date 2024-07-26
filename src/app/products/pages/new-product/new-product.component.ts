import { Component, inject, OnInit, signal } from '@angular/core';
import {
  type AbstractControl,
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import type { IFinancialData } from '@products/models';
import { FinancialService } from '@products/services/financial.service';
import { ModalService } from '@services';
import { ButtonComponent, ModalComponent } from '@shared/components';
import { addYearsToDate, formatInputDate } from '@utils';

@Component({
  selector: 'app-new-product',
  standalone: true,
  templateUrl: './new-product.component.html',
  imports: [ReactiveFormsModule, RouterLink, ModalComponent, ButtonComponent],
})
export default class NewProductComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _modalSvc = inject(ModalService);
  private readonly _financialSvc = inject(FinancialService);

  protected registerForm;
  protected isOpenModal = signal(false);
  protected modalInfo = signal({
    title: 'Crear Producto Financiero',
    message: '¿ Esta seguro/a de crear el producto ?',
  });

  get registerFormControls(): Record<string, AbstractControl> {
    return this.registerForm.controls;
  }

  constructor() {
    this.registerForm = this.setupRegisterForm();
  }

  ngOnInit(): void {
    this.listenReleaseDateChanges();
  }

  private setupRegisterForm() {
    return this._fb.group({
      ID: this._fb.control<string | null>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required, Validators.pattern('https?://.+')]],
      releaseDate: [formatInputDate(new Date()), [Validators.required]],
      revisionDate: [
        {
          value: formatInputDate(addYearsToDate(new Date())),
          disabled: true,
        },
        [Validators.required],
      ],
    });
  }

  private listenReleaseDateChanges(): void {
    this.registerForm.get('releaseDate')?.valueChanges.subscribe(value => {
      if (!value) return;
      const [year, month, day] = value.split('-').map(Number);
      const releaseDate = new Date(year, month - 1, day);
      const revisionDate = addYearsToDate(releaseDate);

      this.registerForm
        .get('revisionDate')
        ?.setValue(formatInputDate(revisionDate));
    });
  }

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markAllAsTouched(this.registerForm);
      return;
    }

    this.showConfirmationModal();
    this._modalSvc.confirmation$.subscribe(isConfirmed => {
      if (!isConfirmed) return;

      this.handleCreateProduct();
    });
  }

  private handleCreateProduct(): void {
    const data = this.mappedFormValues();

    this._financialSvc.createProduct(data).subscribe(data => {
      console.log({ data });
    });
  }

  private showConfirmationModal() {
    this.isOpenModal.set(true);
  }

  private mappedFormValues(): IFinancialData {
    const { ID, name, description, logo, releaseDate, revisionDate } =
      this.registerForm.value;

    return {
      id: ID ?? '',
      name: name ?? '',
      description: description ?? '',
      logo: logo ?? '',
      date_release: releaseDate ? new Date(releaseDate) : new Date(),
      date_revision: revisionDate ? new Date(revisionDate) : new Date(),
    };
  }

  private markAllAsTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  protected resetForm(): void {
    console.log('reset');
    this.registerForm.reset();
  }
}

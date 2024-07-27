import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
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
import { ModalService, NavigationService } from '@services';
import { ButtonComponent, ModalComponent } from '@shared/components';
import { addYearsToDate, formatInputDate } from '@utils';
import { asyncIdValidator } from '@validators';

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
  private readonly _navigationSvc = inject(NavigationService);

  // imputs
  productId = input<string>();

  protected registerForm;
  protected isOpenModal = signal(false);
  protected action = signal<PageAction>('Registrar');
  protected modalInfo = computed(() => ({
    title: `${this.action()} Producto Financiero`,
    message: `¿ Esta seguro/a de ${this.action()} el producto ?`,
  }));

  get registerFormControls(): Record<string, AbstractControl> {
    return this.registerForm.controls;
  }

  constructor() {
    this.registerForm = this.setupRegisterForm();

    effect(() => {
      const productId = this.productId();
      untracked(() => this.handleActionType(productId));
    });
  }

  ngOnInit(): void {
    this.listenReleaseDateChanges();
  }

  private setupRegisterForm() {
    return this._fb.group({
      ID: this._fb.control<string | null>(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        asyncValidators: [asyncIdValidator(this._financialSvc)],
        updateOn: 'blur',
      }),
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

  private handleActionType(productId?: string) {
    if (typeof productId !== 'string') return;

    this.action.set('Actualizar');
    this.retriveProductData(productId);
  }

  private retriveProductData(productId: string): void {
    this._financialSvc.retrieveFinancialDataById(productId).subscribe(data => {
      if (data) {
        this.fillFormValues(data);
      }
    });
  }

  private fillFormValues(data: IFinancialData): void {
    this.registerForm.patchValue({
      ID: data.id,
      name: data.name,
      description: data.description,
      logo: data.logo,
      releaseDate: formatInputDate(new Date(data.date_release)),
      revisionDate: formatInputDate(new Date(data.date_revision)),
    });

    this.registerForm.get('ID')?.disable();
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

      if (this.action() === 'Registrar') {
        this.handleCreateProduct();
      } else {
        this.handleEditProduct();
      }
    });
  }

  private handleCreateProduct(): void {
    const data = this.mappedFormValues();

    this._financialSvc.createProduct(data).subscribe(data => {
      if (data) {
        this.redirectToList();
      }
    });
  }

  private handleEditProduct() {
    const data = this.mappedFormValues();

    this._financialSvc.updateProduct(data.id, data).subscribe(data => {
      if (data) {
        this.redirectToList();
      }
    });
  }

  private showConfirmationModal() {
    this.isOpenModal.set(true);
  }

  private mappedFormValues(): IFinancialData {
    const { ID, name, description, logo, releaseDate, revisionDate } =
      this.registerForm.getRawValue();

    console.log({ releaseDate, revisionDate });

    return {
      id: ID ?? '',
      name: name ?? '',
      description: description ?? '',
      logo: logo ?? '',
      date_release: releaseDate
        ? new Date(releaseDate).toISOString()
        : new Date().toISOString(),
      date_revision: revisionDate
        ? new Date(revisionDate).toISOString()
        : new Date().toISOString(),
    };
  }

  private markAllAsTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  protected resetForm(): void {
    this.registerForm.reset();
  }

  private redirectToList(): void {
    this.resetForm();
    this._navigationSvc.navigateTo(['/']);
  }
}

type PageAction = 'Registrar' | 'Actualizar';

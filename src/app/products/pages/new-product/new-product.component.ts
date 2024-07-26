import { Component, inject, OnInit, signal } from '@angular/core';
import {
  type AbstractControl,
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { addYearsToDate, formatInputDate } from '@utils';

@Component({
  selector: 'app-new-product',
  standalone: true,
  templateUrl: './new-product.component.html',
  imports: [ReactiveFormsModule, RouterLink, ModalComponent],
})
export default class NewProductComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);

  protected registerForm;
  protected isOpenModal = signal(false);

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
      ID: this._fb.control<number | null>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
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

    const { ID } = this.registerForm.value;
    console.log({ ID });
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
}

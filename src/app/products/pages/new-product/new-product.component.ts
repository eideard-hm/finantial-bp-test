import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  type AbstractControl,
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { addYearsToDate, formatInputDate } from '@utils';

@Component({
  selector: 'app-new-product',
  standalone: true,
  templateUrl: './new-product.component.html',
  imports: [ReactiveFormsModule, JsonPipe],
})
export default class NewProductComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);

  protected registerForm;

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
        Validators.pattern('^[0-9]*$'),
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

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulario válido', this.registerForm.value);
      // Aquí puedes manejar el envío del formulario
    } else {
      console.log('Formulario no válido');
      this.markAllAsTouched(this.registerForm);
    }
  }

  private markAllAsTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
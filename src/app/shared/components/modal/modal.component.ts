import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';

import { ButtonComponent } from '../button/button.component';
import { ModalService } from '@services';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
})
export class ModalComponent {
  private readonly _modalSvc = inject(ModalService);

  // inputs
  title = input<string>();
  body = input.required<string>();

  // models
  isOpen = model(false);

  protected handleCancel() {
    this._modalSvc.cancel();
    this.toggleModal(false);
  }

  protected handleConfirm() {
    this._modalSvc.confirm();
    this.toggleModal(false);
  }

  private toggleModal(isOpen: boolean) {
    this.isOpen.set(isOpen);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  // inputs
  title = input<string>();
  body = input.required<string>();

  // models
  isOpen = model(false);
  isConfirmed = model(false);

  protected handleCancel() {
    this.isConfirmed.set(false);
    this.toggleModal(false);
  }

  protected handleConfirm() {
    this.isConfirmed.set(true);
    this.toggleModal(false);
  }

  private toggleModal(isOpen: boolean) {
    this.isOpen.set(isOpen);
  }
}

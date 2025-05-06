// confirmation-modal.component.ts
import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  public dialogRef = inject(MatDialogRef<ConfirmationModalComponent>);
  public data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);
}

import { Component, Inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [],
  standalone: true,
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.scss'
})
export class DeleteConfirmationModalComponent {
  constructor(private dialogRef: DialogRef<DeleteConfirmationModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

}

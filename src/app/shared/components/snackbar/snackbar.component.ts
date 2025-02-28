// src/app/shared/components/custom-snackbar/custom-snackbar.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  standalone: true
})
export class SnackbarComponent {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';

  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
    this.message = data.message;
    this.type = data.type || 'info';
  }
}

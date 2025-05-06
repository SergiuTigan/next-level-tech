// src/app/shared/components/custom-snackbar/custom-snackbar.component.ts
import {Component, inject, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  standalone: true
})
export class SnackbarComponent implements OnInit {
  public snackBarRef = inject(MatSnackBarRef<SnackbarComponent>);
  public data: any = inject(MAT_SNACK_BAR_DATA);

  message!: string;
  type!: 'success' | 'error' | 'warning' | 'info';

  ngOnInit(): void {
    this.message = this.data.message;
    this.type = this.data.type || 'info';
  }
}

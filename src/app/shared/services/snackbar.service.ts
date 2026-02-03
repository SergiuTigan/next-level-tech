// src/app/shared/services/snackbar.service.ts
import {inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {SnackbarComponent} from '../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  readonly snackBar = inject(MatSnackBar);

  /**
   * Opens a custom snackbar with the provided message and type
   */
  openSnackBar(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', config?: MatSnackBarConfig) {
    const defaultConfig: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-tailwind-snackbar']
    };

    const snackbarConfig = {...defaultConfig, ...config};

    return this.snackBar.openFromComponent(SnackbarComponent, {
      ...snackbarConfig,
      data: {message, type}
    });
  }

  // Convenience methods for different alert types
  success(message: string, config?: MatSnackBarConfig) {
    return this.openSnackBar(message, 'success', config);
  }

  error(message: string, config?: MatSnackBarConfig) {
    return this.openSnackBar(message, 'error', config);
  }

  warning(message: string, config?: MatSnackBarConfig) {
    return this.openSnackBar(message, 'warning', config);
  }

  info(message: string, config?: MatSnackBarConfig) {
    return this.openSnackBar(message, 'info', config);
  }
}

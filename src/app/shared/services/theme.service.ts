import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  isDark = signal(this.getInitialTheme());

  private getInitialTheme(): boolean {
    if (typeof window === 'undefined') return true;
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) return stored === 'dark';
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme(): void {
    this.isDark.set(!this.isDark());
    this.applyTheme();
  }

  applyTheme(): void {
    if (typeof document === 'undefined') return;
    
    const html = document.documentElement;
    if (this.isDark()) {
      html.classList.add('dark');
      localStorage.setItem(this.STORAGE_KEY, 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem(this.STORAGE_KEY, 'light');
    }
  }

  init(): void {
    this.applyTheme();
  }
}

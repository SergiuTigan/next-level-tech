import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgClass
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  readonly router = inject(Router);
  readonly themeService = inject(ThemeService);
  mobileMenuHidden = true;

  ngOnInit(): void {
    this.themeService.init();
  }

  isCurrentPage(page: string): boolean {
    return this.router.url.includes(page);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get isDark(): boolean {
    return this.themeService.isDark();
  }
}

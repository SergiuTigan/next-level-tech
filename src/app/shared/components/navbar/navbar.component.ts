import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import {BaseService} from '../../../core/services/base.service';
import {UsersService} from '../../../core/services/users.service';
import {ClickOutsideDirective} from '../../directives/click-outside.directive';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgClass
  ],
  providers: [BaseService],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  readonly router = inject(Router)
  readonly usersService = inject(UsersService)
  mobileMenuHidden: boolean = true;
  isUserLoggedIn = this.usersService.isAuthenticatedCurrent;

  ngOnInit(): void {
  }

  isCurrentPage(page: string): boolean {
    return this.router.url.includes(page);
  }

  openModal(event: any): void {
    this.usersService.saveCurrentState(true);
  }

  logout(): void {
    sessionStorage.clear();
    this.usersService.saveAuthState(false);
    this.router.navigate(['/']);
  }
}

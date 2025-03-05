import { Component, OnInit } from '@angular/core';
import { UsersService } from './core/services/users.service';
import { User } from './shared/models/user.interface';
import { inject } from '@vercel/analytics';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
  providers: []
})
export class AppComponent implements OnInit {
  isOpen$ = this.usersService.isSignInOpenCurrent;

  constructor(private usersService: UsersService) {
  }

  ngOnInit(): void {
    inject();
    sessionStorage.getItem('token') ? this.usersService.saveAuthState(true) : this.usersService.saveAuthState(false);
    if (sessionStorage.getItem('user')) {
      const user: User = JSON.parse(sessionStorage.getItem('user') || '{}');
      this.usersService.saveRole(user.role);
    }
  }

  closeModal() {
    this.usersService.saveCurrentState(false);
  }
}

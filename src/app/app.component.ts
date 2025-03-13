import { Component, OnInit } from '@angular/core';
import { UsersService } from './core/services/users.service';
import { User } from './shared/models/user.interface';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from './shared/helpers/route-animations';

@Component({
  selector: 'app-root',
  animations: [routeAnimations],
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
    injectSpeedInsights();
    sessionStorage.getItem('token') ? this.usersService.saveAuthState(true) : this.usersService.saveAuthState(false);
    if (sessionStorage.getItem('user')) {
      const user: User = JSON.parse(sessionStorage.getItem('user') || '{}');
      this.usersService.saveRole(user.role);
    }
  }

  closeModal() {
    this.usersService.saveCurrentState(false);
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

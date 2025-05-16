import {Component, inject, OnInit} from '@angular/core';
import {UsersService} from './core/services/users.service';
import {User} from './shared/models/user.interface';
import * as vercelInject from '@vercel/analytics';
import {injectSpeedInsights} from '@vercel/speed-insights';
import {RouterOutlet} from '@angular/router';
import {routeAnimations} from './shared/helpers/route-animations';
import {NavbarComponent} from "./shared/components/navbar/navbar.component";
import {FooterComponent} from "./shared/components/footer/footer.component";
import {AsyncPipe} from "@angular/common";
import {LoginFormComponent} from "./shared/components/login-form/login-form.component";
import {BaseService} from "./core/services/base.service";
import {BlogService} from "./core/services/blog.service";
import {SnackbarService} from "./shared/services/snackbar.service";
import {ContactService} from "./core/services/contact.service";
import {ProjectsService} from "./core/services/projects.service";

@Component({
  selector: 'app-root',
  animations: [routeAnimations],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    FooterComponent,
    AsyncPipe,
    LoginFormComponent
  ],
  providers: [UsersService, BaseService, BlogService, SnackbarService, ContactService, ProjectsService],
})
export class AppComponent implements OnInit {
  readonly usersService = inject(UsersService);
  readonly baseService = inject(BaseService);
  isOpen$ = this.usersService.isSignInOpenCurrent;
  loading$ = this.baseService.loading$;

  ngOnInit(): void {
    vercelInject.inject();
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

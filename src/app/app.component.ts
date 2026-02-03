import {Component, inject, OnInit} from '@angular/core';
import * as vercelInject from '@vercel/analytics';
import {injectSpeedInsights} from '@vercel/speed-insights';
import {RouterOutlet} from '@angular/router';
import {routeAnimations} from './shared/helpers/route-animations';
import {NavbarComponent} from "./shared/components/navbar/navbar.component";
import {FooterComponent} from "./shared/components/footer/footer.component";
import {AsyncPipe} from "@angular/common";
import {BaseService} from "./core/services/base.service";
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
    AsyncPipe
  ],
  providers: [BaseService, ProjectsService],
})
export class AppComponent implements OnInit {
  readonly baseService = inject(BaseService);
  loading$ = this.baseService.loading$;

  ngOnInit(): void {
    vercelInject.inject();
    injectSpeedInsights();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

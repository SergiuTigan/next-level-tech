import { Component } from '@angular/core';
import { UsersService } from './core/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
  providers: []
})
export class AppComponent {
  isOpen$ = this.usersService.isSignInOpenCurrent;

  constructor(private usersService: UsersService) {
  }

  closeModal() {
    this.usersService.saveCurrentState(false);
  }
}

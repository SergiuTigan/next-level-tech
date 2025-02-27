import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { BaseService } from '../../../core/services/base.service';
import { UsersService } from '../../../core/services/users.service';

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
  mobileMenuHidden: boolean = true;

  constructor(private router: Router,
              private usersService: UsersService) {
  }

  ngOnInit(): void {
  }

  isCurrentPage(page: string): boolean {
    return this.router.url.includes(page);
  }

  openModal(): void {
    this.usersService.saveCurrentState(true);
  }
}

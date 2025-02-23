import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

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
  mobileMenuHidden: boolean = true;
  constructor(private activatedRoute:ActivatedRoute,
              private router: Router) {}

  ngOnInit() {}

  isCurrentPage(page: string) {
    return this.router.url.includes(page);
  }

}

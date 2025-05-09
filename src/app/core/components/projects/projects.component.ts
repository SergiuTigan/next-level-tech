import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ProjectsService} from "../../services/projects.service";
import {AsyncPipe, NgClass} from "@angular/common";

@Component({
  selector: 'app-projects',
  imports: [
    RouterOutlet
  ],
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {


  ngOnInit(): void {
  }
}

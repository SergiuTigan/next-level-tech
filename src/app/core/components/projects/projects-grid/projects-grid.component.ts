import {Component, inject} from '@angular/core';
import {AsyncPipe, NgClass} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ProjectsService} from "../../../services/projects.service";

@Component({
  selector: 'app-projects-grid',
  imports: [
    AsyncPipe,
    RouterLink,
    NgClass
  ],
  templateUrl: './projects-grid.component.html',
  styleUrl: './projects-grid.component.scss'
})
export class ProjectsGridComponent {
  readonly projectsService = inject(ProjectsService);
  projects$ = this.projectsService.getAllProjects();
  colorClasses = [
    'bg-red-100 text-red-800',
    'bg-green-100 text-green-800',
    'bg-blue-100 text-blue-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800'
  ];
}

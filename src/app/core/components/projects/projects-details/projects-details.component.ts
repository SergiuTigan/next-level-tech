import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IProject} from "../../../../shared/models/project.interface";
import {ProjectsService} from "../../../services/projects.service";
import {SnackbarService} from "../../../../shared/services/snackbar.service";
import {SafeHtmlPipe} from "../../../../shared/pipes/safe-html.pipe";

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.scss'],
  imports: [
    SafeHtmlPipe
  ]
})
export class ProjectsDetailsComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly projectService = inject(ProjectsService);
  readonly snackbarService = inject(SnackbarService);
  project: IProject | null = null;
  error: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProject(id);
    } else {
      this.error = 'No project ID found in route.';
    }
  }

  fetchProject(id: string): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        if (!project) {
          this.snackbarService.error('Project not found');
          return;
        }
        project.content = this.decodeHTMLEntities(project.content);
        this.project = project;
      },
      error: (err) => {
        this.error = 'Project not found or failed to load.';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  private decodeHTMLEntities(str: string): string {

    return str.replaceAll('&nbsp;', ' ')
  }

  shareProject(): void {
    if (!this.project) return;
    const shareData = {
      title: this.project.title,
      text: this.project.description,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }
}

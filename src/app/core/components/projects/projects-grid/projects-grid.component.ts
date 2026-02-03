import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, NgClass} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {ProjectsService} from "../../../services/projects.service";
import {BaseService} from "../../../services/base.service";
import {CapitalizePipe} from "../../../../shared/pipes/capitalize.pipe";
import {MatDialog} from "@angular/material/dialog";
import {SnackbarService} from "../../../../shared/services/snackbar.service";
import {
  ConfirmationModalComponent
} from "../../../../shared/components/modals/delete-confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-projects-grid',
  imports: [
    AsyncPipe,
    RouterLink,
    NgClass,
    CapitalizePipe
  ],
  templateUrl: './projects-grid.component.html',
  styleUrl: './projects-grid.component.scss'
})
export class ProjectsGridComponent implements OnInit {
  readonly baseService = inject(BaseService);
  readonly projectsService = inject(ProjectsService);
  readonly router = inject(Router);
  readonly matDialog = inject(MatDialog);
  readonly snackbarService = inject(SnackbarService);

  projects$ = this.projectsService.getAllProjects();
  colorClasses = [
    'bg-blue-500/20 text-blue-400',
    'bg-green-500/20 text-green-400',
    'bg-cyan-500/20 text-cyan-400',
    'bg-amber-500/20 text-amber-400',
    'bg-rose-500/20 text-rose-400',
    'bg-teal-500/20 text-teal-400',
    'bg-orange-500/20 text-orange-400'
  ];

  get isAdmin() {
    return JSON.parse(sessionStorage.getItem('user') || '{}')?.role?.toLowerCase() === 'admin';
  }

  ngOnInit() {
    this.baseService.setLoading(true);
  }

  editProject(event: Event, projectId: string | undefined): void {
    event.stopPropagation();
    if (!projectId) return;
    this.router.navigate(['/projects/edit', projectId]);
  }

  deleteProject(event: Event, projectId: string | undefined): void {
    event.stopPropagation();
    if (!projectId) return;

    const dialogRef = this.matDialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Delete Project',
        message: 'Are you sure you want to delete this project? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.projectsService.deleteProject(projectId).subscribe({
          next: () => {
            this.snackbarService.success('Project deleted successfully');
            // Refresh the projects list
            this.projects$ = this.projectsService.getAllProjects();
          },
          error: (error) => {
            this.snackbarService.error('Failed to delete project');
          }
        });
      }
    });
  }
}

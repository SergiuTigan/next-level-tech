import {Injectable, inject} from '@angular/core';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {CreateProjectDto, IProject} from '../../shared/models/project.interface';
import {BaseService} from './base.service';
const COLLECTION = 'projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  readonly baseService = inject(BaseService);

  private previewProjectSubject = new BehaviorSubject<IProject>({} as IProject);
  currentPreviewProject$ = this.previewProjectSubject.asObservable();

  getAllProjects(): Observable<IProject[]> {
    return from(this.baseService.getAll<IProject>(COLLECTION)).pipe(
      map(projects => projects.map(p => this.normalizeProject(p))),
      catchError(error => {
        console.error('[ProjectsService] Error:', error);
        return of([]);
      })
    );
  }

  getProjectById(id: string): Observable<IProject> {
    return from(this.baseService.getById<IProject>(COLLECTION, id)).pipe(
      map(project => {
        if (!project) throw new Error('Project not found');
        return this.normalizeProject(project);
      })
    );
  }

  createProject(projectData: CreateProjectDto): Observable<IProject> {
    return from(this.createProjectAsync(projectData));
  }

  private async createProjectAsync(projectData: CreateProjectDto): Promise<IProject> {
    const project: Partial<IProject> = {
      title: projectData.title,
      content: projectData.content,
      description: projectData.description,
      techUsed: projectData.techUsed,
      additionalImages: []
    };

    // Upload cover image
    if (projectData.coverImage && projectData.coverImage.size > 0) {
      const path = `projects/${Date.now()}_cover_${projectData.coverImage.name}`;
      project.coverImage = await this.baseService.uploadFile(path, projectData.coverImage);
    }

    // Upload thumbnail
    if (projectData.thumbnail && projectData.thumbnail.size > 0) {
      const path = `projects/${Date.now()}_thumb_${projectData.thumbnail.name}`;
      project.thumbnail = await this.baseService.uploadFile(path, projectData.thumbnail);
    }

    // Upload additional images
    if (projectData.additionalImages && projectData.additionalImages.length > 0) {
      for (let i = 0; i < projectData.additionalImages.length; i++) {
        const file = projectData.additionalImages[i];
        if (file && file.size > 0) {
          const path = `projects/${Date.now()}_${i}_${file.name}`;
          const url = await this.baseService.uploadFile(path, file);
          project.additionalImages!.push({
            url,
            description: projectData.imageDescriptions?.[i] || ''
          });
        }
      }
    }

    return this.baseService.create<IProject>(COLLECTION, project);
  }

  updateProject(id: string, projectData: CreateProjectDto): Observable<IProject> {
    return from(this.updateProjectAsync(id, projectData));
  }

  private async updateProjectAsync(id: string, projectData: CreateProjectDto): Promise<IProject> {
    const existingProject = await this.baseService.getById<IProject>(COLLECTION, id);
    if (!existingProject) throw new Error('Project not found');

    const project: Partial<IProject> = {
      title: projectData.title,
      content: projectData.content,
      description: projectData.description,
      techUsed: projectData.techUsed
    };

    // Upload new cover image if provided
    if (projectData.coverImage && projectData.coverImage.size > 0) {
      const path = `projects/${id}_cover_${projectData.coverImage.name}`;
      project.coverImage = await this.baseService.uploadFile(path, projectData.coverImage);
    }

    // Upload new thumbnail if provided
    if (projectData.thumbnail && projectData.thumbnail.size > 0) {
      const path = `projects/${id}_thumb_${projectData.thumbnail.name}`;
      project.thumbnail = await this.baseService.uploadFile(path, projectData.thumbnail);
    }

    // Handle removed images
    if (projectData.removedImages && projectData.removedImages.length > 0) {
      const remainingImages = (existingProject.additionalImages || []).filter(
        img => !projectData.removedImages!.includes(img.url)
      );
      project.additionalImages = remainingImages;
    }

    // Upload new additional images
    if (projectData.additionalImages && projectData.additionalImages.length > 0) {
      const currentImages = project.additionalImages || existingProject.additionalImages || [];
      for (let i = 0; i < projectData.additionalImages.length; i++) {
        const file = projectData.additionalImages[i];
        if (file && file.size > 0) {
          const path = `projects/${id}_${Date.now()}_${i}_${file.name}`;
          const url = await this.baseService.uploadFile(path, file);
          currentImages.push({
            url,
            description: projectData.imageDescriptions?.[i] || ''
          });
        }
      }
      project.additionalImages = currentImages;
    }

    return this.baseService.update<IProject>(COLLECTION, id, project);
  }

  deleteProject(id: string): Observable<void> {
    return from(this.baseService.delete(COLLECTION, id));
  }

  savePreviewProject(project: IProject): void {
    this.previewProjectSubject.next(project);
  }

  private normalizeProject(project: IProject): IProject {
    // Ensure techUsed is always an array of strings
    let techUsed = project.techUsed;
    if (typeof techUsed === 'string') {
      techUsed = (techUsed as string).split(',').map(t => t.trim());
    } else if (Array.isArray(techUsed) && techUsed.length === 1 && typeof techUsed[0] === 'string') {
      // Handle legacy format where techUsed was stored as ["tech1,tech2,tech3"]
      techUsed = techUsed[0].split(',').map(t => t.trim());
    }

    return {
      ...project,
      _id: project.id || project._id,
      id: project.id || project._id,
      techUsed
    };
  }
}

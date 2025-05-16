import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, finalize, map, Observable} from 'rxjs';
import {CreateProjectDto, IProject} from '../../shared/models/project.interface';
import {environment} from "../../../assets/environment/environment";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly http = inject(HttpClient);
  readonly baseService = inject(BaseService);
  private apiUrl = `${environment.baseUrl}/projects`;

  private previewProjectSubject = new BehaviorSubject<IProject>({} as IProject);
  currentPreviewProject$ = this.previewProjectSubject.asObservable();

  getAllProjects(): Observable<IProject[]> {
    this.baseService.setLoading(true);
    return this.http.get<IProject[]>(this.apiUrl).pipe(finalize(() => {
      this.baseService.setLoading(false);
    }));
  }

  getProjectById(id: string): Observable<IProject> {
    return this.http.get<IProject>(`${this.apiUrl}/${id}`);
  }

  createProject(projectData: CreateProjectDto): Observable<IProject> {
    const formData = new FormData();

    formData.append('title', projectData.title);
    formData.append('content', projectData.content);
    formData.append('description', projectData.description);
    formData.append('techUsed', projectData.techUsed.join(','));

    if (projectData.coverImage) {
      formData.append('coverImage', projectData.coverImage);
    }

    if (projectData.thumbnail) {
      formData.append('thumbnail', projectData.thumbnail);
    }

    // Handle images and their descriptions
    if (projectData.additionalImages && projectData.additionalImages.length > 0) {
      formData.append('imageMetadata', JSON.stringify(
        Object.entries(projectData.imageDescriptions || {}).map(([index, description]) => ({description}))
      ));

      projectData.additionalImages.forEach(img => {
        formData.append('additionalImages', img);
      });
    }

    return this.http.post<IProject>(this.apiUrl, formData);
  }

  updateProject(id: string, projectData: CreateProjectDto): Observable<IProject> {
    // Convert to proper format for API
    const formData = new FormData();

    formData.append('title', projectData.title);
    formData.append('content', projectData.content);
    formData.append('description', projectData.description);
    formData.append('techUsed', projectData.techUsed.join(','));

    if (projectData.coverImage) {
      formData.append('coverImage', projectData.coverImage);
    }

    if (projectData.thumbnail) {
      formData.append('thumbnail', projectData.thumbnail);
    }

    // Handle images and their descriptions
    if (projectData.additionalImages && projectData.additionalImages.length > 0) {
      formData.append('imageMetadata', JSON.stringify(
        Object.entries(projectData.imageDescriptions || {}).map(([index, description]) => ({description}))
      ));

      projectData.additionalImages.forEach(img => {
        formData.append('additionalImages', img);
      });
    }

    // Handle removed images
    if (projectData.removedImages && projectData.removedImages.length > 0) {
      formData.append('removedImages', JSON.stringify(projectData.removedImages));
    }

    return this.http.patch<IProject>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  savePreviewProject(project: IProject): void {
    this.previewProjectSubject.next(project);
  }
}

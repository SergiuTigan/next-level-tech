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
        return this.http.get<IProject[]>(this.apiUrl).pipe(map((data: IProject[]) => {
            for (const project of data) {
                project.techUsed = project.techUsed[0].split(',');
            }
            return data;
        }), finalize(() => {
            this.baseService.setLoading(false);
        }));
    }

    getProjectById(id: string): Observable<IProject> {
        return this.http.get<IProject>(`${this.apiUrl}/${id}`).pipe(map((project: IProject) => {
            project.techUsed = project.techUsed[0].split(',')
            return project;
        }));
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
        if (projectData.images && projectData.images.length > 0) {
            formData.append('imageMetadata', JSON.stringify(
                Object.entries(projectData.imageDescriptions || {}).map(([index, description]) => ({description}))
            ));

            projectData.images.forEach(img => {
                formData.append('images', img);
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
        if (projectData.images && projectData.images.length > 0) {
            formData.append('imageMetadata', JSON.stringify(
                Object.entries(projectData.imageDescriptions || {}).map(([index, description]) => ({description}))
            ));

            projectData.images.forEach(img => {
                formData.append('images', img);
            });
        }

        return this.http.put<IProject>(`${this.apiUrl}/${id}`, formData);
    }

    deleteProject(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    savePreviewProject(project: IProject): void {
        this.previewProjectSubject.next(project);
    }
}

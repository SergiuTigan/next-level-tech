import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {CreateProjectDto, IProject} from '../../../../shared/models/project.interface';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {QuillEditorComponent} from 'ngx-quill';
import {SnackbarService} from '../../../../shared/services/snackbar.service';
import {BaseService} from "../../../services/base.service";
import {ProjectsService} from "../../../services/projects.service";
import {NgForOf, NgIf} from "@angular/common";
import {AdditionalImagesComponent} from "../../../../shared/components/additional-images/additional-images.component";

@Component({
  selector: 'app-project-create',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    QuillEditorComponent,
    NgForOf,
    NgIf,
    AdditionalImagesComponent
  ],
  standalone: true,
  templateUrl: './projects-create.component.html',
  styleUrl: './projects-create.component.scss'
})
export class ProjectsCreateComponent implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly projectService = inject(ProjectsService);
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly snackbarService = inject(SnackbarService);
  readonly baseService = inject(BaseService);

  @Output() createProject = new EventEmitter<CreateProjectDto>();
  @Output() close = new EventEmitter<boolean>();

  projectForm!: FormGroup;

  coverImageFile: File | null = null;
  coverImagePreview: string | null = null;
  coverImageError: string | null = null;

  thumbnailFile: File | null = null;
  thumbnailPreview: string | null = null;
  isEditMode: boolean = false;
  projectId: string = '';

  additionalImages: any[] = [];
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{'header': 1}, {'header': 2}],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': '_id'}, {'script': 'super'}],
      [{'indent': '-1'}, {'indent': '+1'}],
      [{'direction': 'rtl'}],
      [{'size': ['small', false, 'large', 'huge']}],
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
      [{'color': []}, {'background': []}],
      [{'font': []}],
      [{'align': []}],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  get submitDisabled(): boolean {
    return this.projectForm.invalid ||
      !this.coverImageFile ||
      !this.thumbnailFile ||
      !!this.coverImageError ||
      this.hasAdditionalImageErrors();
  }

  ngOnInit(): void {
    this.baseService.setLoading(true);
    this.initForm();
    this.projectId = this.activatedRoute.snapshot.params['id'];
    if (this.projectId) {
      this.isEditMode = true;
      this.projectService.getProjectById(this.projectId).subscribe(project => {
        this.baseService.setLoading(false);
        this.projectForm.patchValue({
          title: project.title,
          content: project.content,
          description: project.description,
          techUsed: project.techUsed.join(',')
        });

        this.coverImagePreview = project.coverImage;
        this.thumbnailPreview = project.thumbnail;
        this.coverImageFile = new File([], project.coverImage);
        this.thumbnailFile = new File([], project.thumbnail);

        // Clear the additionalImages array before adding new items
        this.additionalImages = [];
        
        if (project.additionalImages.length) {
          project.additionalImages.forEach((img: any) => {
            this.additionalImages.push({
              description: img.description,
              preview: img.url,
              url: img.url
            });
          });
        }
      });
    } else {
      this.projectService.currentPreviewProject$.subscribe(project => {
        this.baseService.setLoading(false);
        if (Object.keys(project).length) {
          this.projectForm.patchValue({
            title: project.title,
            content: project.content,
            description: project.description,
            techUsed: project.techUsed ? project.techUsed.join(',') : []
          });

          this.coverImagePreview = project.coverImage;
          this.thumbnailPreview = project.thumbnail;
          this.coverImageFile = new File([], project.coverImage);
          this.thumbnailFile = new File([], project.thumbnail);

          // Clear the additionalImages array before adding new items
          this.additionalImages = [];
          
          if (project.additionalImages?.length) {
            project.additionalImages.forEach((img: any) => {
              this.additionalImages.push({
                description: img.description,
                preview: img.url,
                url: img.url
              });
            });
          }
        }
      });
    }
  }

  private initForm() {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      description: ['', Validators.required],
      techUsed: ['']
    });
  }

  onImagesChange(images: any[]) {
    this.additionalImages = images;
  }

  onRemovedImagesChange(removedImages: string[]) {
    // Create or update the removedImages FormArray
    if (!this.projectForm.get('removedImages')) {
      this.projectForm.addControl('removedImages', this.fb.array([]));
    }
    
    const removedImagesArray = this.projectForm.get('removedImages') as FormArray;
    // Clear existing items
    while (removedImagesArray.length) {
      removedImagesArray.removeAt(0);
    }
    // Add new items
    removedImages.forEach(url => {
      removedImagesArray.push(this.fb.control(url));
    });
  }

  onCoverImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.coverImageFile = file;

      if (file.size > 5 * 1024 * 1024) {
        this.coverImageError = 'Image must be smaller than 5MB';
        this.coverImagePreview = null;
        return;
      }

      if (!file.type.match('image.*')) {
        this.coverImageError = 'Only image files are allowed';
        this.coverImagePreview = null;
        return;
      }

      this.coverImageError = null;

      const reader = new FileReader();
      reader.onload = () => {
        this.coverImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeCoverImage() {
    this.coverImageFile = null;
    this.coverImagePreview = null;
    this.coverImageError = null;
  }

  onThumbnailSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.thumbnailFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeThumbnail() {
    this.thumbnailFile = null;
    this.thumbnailPreview = null;
  }

  createProjectDto(): CreateProjectDto {
    const formValues = this.projectForm.value;

    // Process tech used - either split string by comma or use array
    const techUsed = typeof formValues.techUsed === 'string'
      ? formValues.techUsed.split(',').map((tech: string) => tech.trim()).filter((tech: string) => tech)
      : formValues.techUsed || [];

    // In edit mode, include both new images (with files) and existing images (with URLs)
    // In create mode, only include images with files
    const validImages = this.isEditMode
      ? this.additionalImages.filter(img => img.file || img.url)
      : this.additionalImages.filter(img => img.file);

    // Get removed images if in edit mode
    const removedImages = this.isEditMode && this.projectForm.get('removedImages')
      ? (this.projectForm.get('removedImages') as FormArray).value
      : [];

    // Create project with proper typing
    return {
      title: formValues.title,
      content: formValues.content,
      description: formValues.description,
      techUsed: techUsed,
      coverImage: this.coverImageFile!,
      thumbnail: this.thumbnailFile!,
      additionalImages: validImages.filter(img => img.file).map(img => img.file),
      imageDescriptions: validImages.reduce((acc, img, index) => {
        acc[index.toString()] = img.description || '';
        return acc;
      }, {} as { [key: string]: string }),
      removedImages: removedImages
    };
  }

  preparePreviewData(): IProject {
    const formValues = this.projectForm.value;

    const techUsed = typeof formValues.techUsed === 'string'
      ? formValues.techUsed.split(',').map((tech: string) => tech.trim()).filter((tech: string) => tech)
      : formValues.techUsed || [];

    const images = this.additionalImages.map(img => ({url: img.preview, description: img.description}));

    return {
      title: formValues.title,
      content: formValues.content,
      description: formValues.description,
      createDate: new Date().toISOString(),
      coverImage: this.coverImagePreview || '',
      thumbnail: this.thumbnailPreview || '',
      techUsed,
      additionalImages: images
    };
  }

  onSubmit(): void {
    if (this.projectForm.valid && this.coverImageFile && !this.coverImageError) {
      if (this.isEditMode && this.projectId) {
        this.updateProject(this.createProjectDto());
      } else {
        this.createNewProject(this.createProjectDto());
      }
    }
  }

  private createNewProject(project: CreateProjectDto): void {
    this.projectService.savePreviewProject({} as IProject);
    this.projectService.createProject(project).subscribe(
      () => {
        this.projectForm.reset();
        this.router.navigate(['./projects']).then();
        this.snackbarService.success('Project created successfully');
      },
      () => {
        this.snackbarService.error('Failed to create project');
      }
    );
  }

  private updateProject(project: CreateProjectDto): void {
    this.projectService.updateProject(this.projectId, project).subscribe(
      () => {
        this.projectForm.reset();
        this.router.navigate(['./projects']).then();
        this.snackbarService.success('Project updated successfully');
      },
      () => {
        this.snackbarService.error('Failed to update project')
      }
    );
  }

  openPreview(): void {
    this.projectService.savePreviewProject(this.preparePreviewData());
    this.router.navigate(['/projects/details', 'preview']).then();
  }

  hasAdditionalImageErrors(): boolean {
    return this.additionalImages.some(img => !!img.error);
  }
}

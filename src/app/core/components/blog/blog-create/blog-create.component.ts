import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {Article, CreateArticleDto} from '../../../../shared/models/article.interface';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BlogService} from '../../../services/blog.service';
import {QuillEditorComponent} from 'ngx-quill';
import {SnackbarService} from '../../../../shared/services/snackbar.service';
import {BaseService} from "../../../services/base.service";
import {NgForOf, NgIf} from "@angular/common";
import {AdditionalImagesComponent} from "../../../../shared/components/additional-images/additional-images.component";

@Component({
  selector: 'app-blog-create',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    QuillEditorComponent,
    NgForOf,
    NgIf,
    AdditionalImagesComponent
  ],
  standalone: true,
  templateUrl: './blog-create.component.html',
  styleUrl: './blog-create.component.scss'
})
export class BlogCreateComponent implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly blogService = inject(BlogService);
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly snackbarService = inject(SnackbarService);
  readonly baseService = inject(BaseService);

  @Output() createPost = new EventEmitter<CreateArticleDto>();
  @Output() close = new EventEmitter<boolean>();

  createPostForm!: FormGroup;
  categories = ['Technology', 'Health', 'Sports', 'Business']; // Example categories

  coverImageFile: File | null = null;
  coverImagePreview: string | null = null;
  coverImageError: string | null = null;

  thumbnailFile: File | null = null;
  thumbnailPreview: string | null = null;
  isEditMode: boolean = false;
  postId: string = '';
  user = JSON.parse(sessionStorage.getItem('user') || '{}');

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

    return this.createPostForm.invalid ||
      !this.coverImageFile ||
      !this.thumbnailFile ||
      !!this.coverImageError ||
      this.hasAdditionalImageErrors();
  }

  ngOnInit(): void {
    this.initForm();
    this.postId = this.activatedRoute.snapshot.params['id'];
    if (this.postId) {
      this.isEditMode = true;
      this.blogService.getArticleById(this.activatedRoute.snapshot.params['id']).subscribe(post => {
        this.createPostForm.patchValue({
          title: post.title,
          content: post.content,
          description: post.description,
          category: post.category,
          tags: post.tags.join(',')
        });

        this.coverImagePreview = post.coverImage;
        this.thumbnailPreview = post.thumbnail;
        this.coverImageFile = new File([], post.coverImage);
        this.thumbnailFile = new File([], post.thumbnail);

        // Handle additional images
        if (post.additionalImages && post.additionalImages.length) {
          this.additionalImages = post.additionalImages;
        }
      });
    } else {
      this.blogService.currentPreviewArticle$.subscribe(article => {
        if (Object.keys(article).length) {
          this.createPostForm.patchValue({
            title: article.title,
            content: article.content,
            description: article.description,
            category: article.category,
            tags: article.tags ? article.tags.join(',') : []
          });

          this.coverImagePreview = article.coverImage;
          this.thumbnailPreview = article.thumbnail;
          this.coverImageFile = new File([], article.coverImage);
          this.thumbnailFile = new File([], article.thumbnail);

          // Handle additional images
          if (article.additionalImages?.length) {
            this.additionalImages = article.additionalImages;
          }
        }
      });
    }
  }

  private initForm() {
    this.createPostForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      tags: [''],
    });

    // Add removedImages control separately to track images that should be removed during update
    this.createPostForm.addControl('removedImages', this.fb.array([]));
  }

  onImagesChange(images: any[]) {
    this.additionalImages = images;
  }

  onRemovedImagesChange(removedImages: string[]) {
    // Create or update the removedImages FormArray
    if (!this.createPostForm.get('removedImages')) {
      this.createPostForm.addControl('removedImages', this.fb.array([]));
    }
    
    const removedImagesArray = this.createPostForm.get('removedImages') as FormArray;
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

  prepareFormData(): FormData {
    const formValues = this.createPostForm.value;
    const formData = new FormData();
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const tags = typeof formValues.tags === 'string'
      ? formValues.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      : formValues.tags || [];

    formData.append('title', formValues.title);
    formData.append('published', 'false');
    formData.append('content', formValues.content);
    formData.append('description', formValues.description);
    formData.append('category', formValues.category);
    formData.append('tags', tags.join(','));
    formData.append('createDate', new Date().toISOString());
    formData.append('authorId', user._id);
    formData.append('coverImage', this.coverImageFile ? this.coverImageFile : '');

    formData.append('thumbnail', this.thumbnailFile ? this.thumbnailFile : '');
    const validImages = this.additionalImages.filter(img => img.file);

    formData.append('imageMetadata', JSON.stringify(
      validImages.map(img => ({description: img.description || ''}))
    ));

    validImages.forEach((img) => {
      if (img.file) {
        formData.append('additionalImages', img.file);
      }
    });

    // Add removed images to the form data
    const removedImages = this.createPostForm.get('removedImages') as FormArray;
    removedImages.controls.forEach((control) => {
      formData.append('removedImages', control.value);
    });

    return formData;
  }

  preparePreviewData(): Article {
    const formValues = this.createPostForm.value;
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const tags = typeof formValues.tags === 'string'
      ? formValues.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      : formValues.tags || [];

    const images = this.additionalImages.map(img => ({url: img.preview, description: img.description}));

    return {
      title: formValues.title,
      published: false,
      content: formValues.content,
      description: formValues.description,
      category: formValues.category,
      createDate: new Date().toISOString(),
      author: user,
      coverImage: this.coverImagePreview || '',
      thumbnail: this.thumbnailPreview || '',
      tags,
      likes: [],
      additionalImages: images,
      comments: []
    };
  }

  onSubmit(): void {
    if (this.createPostForm.valid && this.coverImageFile && !this.coverImageError) {
      if (this.isEditMode && this.postId) {
        this.updateArticle(this.prepareFormData());
      } else {
        this.createNewArticle(this.prepareFormData());
      }
    }
  }

  private createNewArticle(article: FormData): void {
    this.blogService.savePreviewArticle({} as Article);
    this.blogService.createArticle(article).subscribe(
      () => {
        this.createPostForm.reset();
        this.router.navigate(['./blog']).then();
        this.snackbarService.success('Article created successfully');
      },
      () => {
        this.snackbarService.error('Failed to create article');
      }
    );
  }

  private updateArticle(article: FormData): void {
    this.blogService.updateArticle(this.postId, article).subscribe(
      () => {
        this.createPostForm.reset();
        this.router.navigate(['./blog']).then();
        this.snackbarService.success('Article updated successfully');
      },
      () => {
        this.snackbarService.error('Failed to create article')
      }
    );
  }

  openPreview(): void {
    this.blogService.savePreviewArticle(this.preparePreviewData() as Article);
    this.router.navigate(['/blog/details', 'preview']).then();
  }

  hasAdditionalImageErrors(): boolean {
    return this.additionalImages.some(img => !!img.error);
  }
}

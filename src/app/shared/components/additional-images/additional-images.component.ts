import {Component, EventEmitter, inject, model, input, output, OnInit, OnChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

interface AdditionalImage {
  description: string;
  preview: string;
  url?: string;
  file?: File | null;
  error?: string | null;
}

@Component({
  selector: 'app-additional-images',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './additional-images.component.html',
  styleUrls: ['./additional-images.component.scss']
})
export class AdditionalImagesComponent implements OnInit, OnChanges {
  // Inputs
  images = input<AdditionalImage[]>([]);
  isEditMode = input<boolean>(false);

  // Outputs with two-way binding
  imagesChange = output<AdditionalImage[]>();
  removedImagesChange = output<string[]>();

  // DI using inject
  private fb = inject(FormBuilder);

  // Form controls
  imageForm = this.fb.group({
    imageItems: this.fb.array([])
  });

  removedImages: string[] = [];

  // Get form array accessor
  get imageItems() {
    return this.imageForm.get('imageItems') as FormArray;
  }

  // Lifecycle hooks
  ngOnInit() {
    this.rebuildForm();
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  private rebuildForm() {
    // Clear the form array
    while (this.imageItems.length) {
      this.imageItems.removeAt(0);
    }

    // Add form controls for each image
    if (this.images() && this.images().length) {
      this.images().forEach(img => {
        this.addImageItemToForm(img.description || '');
      });
    }
  }

  addImage() {
    const newImage: AdditionalImage = {
      description: '',
      preview: '',
      url: '',
      file: null
    };

    // Add to the beginning of the array
    const updatedImages = [newImage, ...this.images()];
    this.imagesChange.emit(updatedImages);

    // Update form
    this.addImageItemToForm('');
  }

  private addImageItemToForm(description: string) {
    const imageItemGroup = this.fb.group({
      description: [description]
    });

    // Add to the beginning of the FormArray
    this.imageItems.insert(0, imageItemGroup);
  }

  removeImage(index: number) {
    // If in edit mode and the image has a URL but no file, track it for removal
    const removedImage = this.images()[index];
    if (this.isEditMode() && removedImage && removedImage.url && !removedImage.file) {
      this.removedImages.push(removedImage.url);
      this.removedImagesChange.emit(this.removedImages);
    }

    // Remove from form array
    this.imageItems.removeAt(index);

    // Create new array without the removed image
    const updatedImages = [...this.images()];
    updatedImages.splice(index, 1);
    this.imagesChange.emit(updatedImages);
  }

  onImageSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        const updatedImages = [...this.images()];
        updatedImages[index] = {
          ...updatedImages[index],
          preview: '',
          error: 'Image must be smaller than 5MB'
        };
        this.imagesChange.emit(updatedImages);
        return;
      }

      // Validate file type
      if (!file.type.match('image.*')) {
        const updatedImages = [...this.images()];
        updatedImages[index] = {
          ...updatedImages[index],
          preview: '',
          error: 'Only image files are allowed'
        };
        this.imagesChange.emit(updatedImages);
        return;
      }

      // Read and display the file
      const reader = new FileReader();
      reader.onload = () => {
        const updatedImages = [...this.images()];
        updatedImages[index] = {
          ...updatedImages[index],
          file: file,
          preview: reader.result as string,
          url: reader.result as string, // Also set the URL to ensure it's recognized as an existing image
          error: undefined,
          description: this.imageItems.at(index).get('description')?.value || ''
        };
        this.imagesChange.emit(updatedImages);
      };
      reader.readAsDataURL(file);
    }
  }

  updateDescription(index: number) {
    if (this.images()[index]) {
      const updatedImages = [...this.images()];
      updatedImages[index] = {
        ...updatedImages[index],
        description: this.imageItems.at(index).get('description')?.value || ''
      };
      this.imagesChange.emit(updatedImages);
    }
  }

  getImagePreview(index: number): string | null {
    return this.images()[index]?.preview || this.images()[index]?.url || null;
  }

  getImageError(index: number): string | null {
    return this.images()[index]?.error || null;
  }

  hasImageErrors(): boolean {
    return this.images().some(img => !!img.error);
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CreateArticleDto } from '../../../../shared/models/article.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-blog-create',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './blog-create.component.html',
  styleUrl: './blog-create.component.scss'
})
export class BlogCreateComponent implements OnInit{
  @Output() createPost = new EventEmitter<CreateArticleDto>();
  createPostForm!: FormGroup;
  categories = ['Technology', 'Health', 'Sports', 'Business']; // Example categories

  constructor() {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(){
    this.createPostForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      content: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      coverImage: new FormControl(null, Validators.required),
      images: new FormControl([]),
      tags: new FormControl([]),
      thumbnail: new FormControl(null),
      author: new FormControl(null),
    });
  }

  onSubmit() {
    if (this.createPostForm.valid) {
      console.log('Form Submitted:', this.createPostForm.value);
    }
  }
}

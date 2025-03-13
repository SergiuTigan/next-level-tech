import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  template: `
    <div [@pulseAnimation]="'active'" class="animate-pulse">
      <div class="rounded-lg overflow-hidden">
        <div class="bg-gray-300 h-48 w-full"></div>
      </div>
      <div class="mt-4">
        <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div class="mt-4">
        <div class="h-10 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  `,
  animations: [
    trigger('pulseAnimation', [
      transition('* <=> *', [
        style({ opacity: 0.5 }),
        animate('1s ease-in-out', style({ opacity: 1 })),
        animate('1s ease-in-out', style({ opacity: 0.5 }))
      ])
    ])
  ]
})
export class SkeletonLoaderComponent {
  @Input() type: 'card' | 'text' | 'avatar' = 'card';
}

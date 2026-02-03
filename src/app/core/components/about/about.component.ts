import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  technologies = [
    { name: 'Angular', icon: '🅰️' },
    { name: 'React', icon: '⚛️' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'JavaScript', icon: '🟨' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'Firebase', icon: '🔥' },
    { name: 'Node.js', icon: '💚' },
    { name: 'Git', icon: '📦' }
  ];
}

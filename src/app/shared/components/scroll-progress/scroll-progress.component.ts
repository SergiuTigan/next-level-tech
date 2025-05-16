import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scroll-progress-container">
      <div class="scroll-progress-bar" [style.width.%]="scrollProgress"></div>
    </div>
  `,
  styles: [`
    .scroll-progress-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      z-index: 1000;
      background: transparent;
    }
    .scroll-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #c2185b 0%, #7b1fa2 50%, #c2185b 100%);
      width: 0;
      transition: width 0.1s ease;
    }
  `]
})
export class ScrollProgressComponent implements OnInit, OnDestroy {
  scrollProgress = 0;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initScrollListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initScrollListener(): void {
    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(10),
        map(() => this.calculateScrollProgress()),
        takeUntil(this.destroy$)
      )
      .subscribe(progress => {
        this.scrollProgress = progress;
      });
  }

  private calculateScrollProgress(): number {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  }
}

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AppContextService } from '../services/app-context.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss'],
})
export class StageComponent implements OnInit, OnDestroy {
  imageSubscription!: Subscription;
  image!: HTMLImageElement | null;
  isThrottling = false;
  throttleDelay = 15;
  constructor(public appContext: AppContextService) {}

  ngOnInit(): void {
    this.imageSubscription = this.appContext.image$.subscribe((img) => {
      this.image = img;
    });
  }

  ngOnDestroy() {
    this.imageSubscription.unsubscribe();
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: any) {
    if (!this.isThrottling) {
      this.isThrottling = true;
      setTimeout(() => (this.isThrottling = false), this.throttleDelay);

      const el = event.target as HTMLElement;
      const rect = el.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      if (this.image) {
        const imageScale = this.image.width / el.offsetWidth;
        x *= imageScale;
        y *= imageScale;
        
        this.appContext.setClicks([{ x, y, clickType: 1 }]);
      }
    }
  }
}

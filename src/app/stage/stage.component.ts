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
  clicks: any = [];
  constructor(public appContext: AppContextService) {}

  ngOnInit(): void {
    this.imageSubscription = this.appContext.image$.subscribe((img) => {
      this.image = img;
    });
  }

  ngOnDestroy() {
    this.imageSubscription.unsubscribe();
  }
  @HostListener('mousedown', ['$event'])
  handleMouseClick(event: any) {
    this.clicks = [];
    const el = event.target as HTMLElement;
    const rect = el.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (this.image) {
      const imageScale = this.image.width / el.clientWidth;
      x *= imageScale;
      y *= imageScale;

      this.clicks.push({ x, y, clickType: 0 });
    }
  }

  @HostListener('mouseup', ['$event'])
  handleMouseUp(event: any) {
    const el = event.target as HTMLElement;
    const rect = el.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (this.image) {
      const imageScale = this.image.width / el.clientWidth;
      x *= imageScale;
      y *= imageScale;

      this.clicks.push({ x, y, clickType: 0 });
      this.appContext.setClicks(this.clicks);
    }
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

        // this.appContext.setClicks([{ x, y, clickType: 1 }]);
      }
    }
  }
}

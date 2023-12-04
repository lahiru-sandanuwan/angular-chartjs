import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AppContextService } from '../services/app-context.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import * as d3 from 'd3';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss'],
})
export class ToolComponent implements OnInit {
  @Output() mouseMove = new EventEmitter<MouseEvent>();

  shouldFitToWidth = true;
  imageSubscription!: Subscription;
  maskImgSubscription!: Subscription;
  image: HTMLImageElement | null = null;
  maskImg: HTMLImageElement | null = null;
  private ngUnsubscribe = new Subject();

  constructor(public appService: AppContextService) {}

  ngOnInit() {
    this.imageSubscription = this.appService.image$.subscribe((image) => {
      this.image = image;
      this.fitToPage();
    });

    this.maskImgSubscription = this.appService.maskImg$.subscribe((maskImg) => {
      this.maskImg = maskImg;
    });

    this.fitToPage();
    this.getPolygonPoints();
  }

  ngOnDestroy() {
    this.imageSubscription.unsubscribe();
    this.maskImgSubscription.unsubscribe();
  }

  getPolygonPoints(): void {
    this.appService
      .getPolygonPoints()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        this.drawPolygon(data);
      });
  }

  @HostListener('window:resize')
  fitToPage() {
    if (!this.image) return;
    const imageAspectRatio = this.image.width / this.image.height;
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    this.shouldFitToWidth = imageAspectRatio > screenAspectRatio;
  }

  onMouseMove(event: MouseEvent) {
    this.mouseMove.emit(event);
  }

  onMouseOut() {
    this.appService.setMaskImg(null);
  }

  drawPolygon(points: any): void {
    const svg = d3.select('svg');
    // Assuming pointsData is already available here
    // points.forEach((polygon: any) => {
    //   svg
    //     .append('polygon')
    //     .attr('points', polygon.map((point: any) => point.join(',')).join(' '))
    //     .attr('stroke', 'black')
    //     .attr('stroke-width', 2)
    //     .attr('fill', 'none');
    // });
  }
}

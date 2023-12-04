import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AppContextService } from '../services/app-context.service';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss'],
})
export class StageComponent implements OnInit, OnDestroy {
  imageSubscription!: Subscription;
  shapesSubscription!: Subscription;
  image!: HTMLImageElement | null;
  isThrottling = false;
  throttleDelay = 15;
  clicks: any = [];

  isDrawing: boolean;
  rect: any;
  svg: any;
  startX: number;
  startY: number;

  constructor(public appContext: AppContextService) {
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
  }

  ngOnInit(): void {
    this.svg = d3.select('#svgItem');

    this.imageSubscription = this.appContext.image$.subscribe((img) => {
      this.image = img;
    });

    this.shapesSubscription = this.appContext.shapePoints$.subscribe(
      (shapes) => {
        this.drawShapes(shapes);
      }
    );
  }

  ngOnDestroy() {
    this.imageSubscription.unsubscribe();
  }

  drawShapes(shapes: any) {
    if (shapes) {
      console.log('Filtered count:', shapes.length);

      this.svg.selectAll('rect').remove();
      this.svg.selectAll('polygon').remove();
      shapes.forEach((shape: any) => {
        this.svg
          .append('polygon')
          .attr('points', shape)
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('fill', 'none');
      });
    }
  }

  @HostListener('mousedown', ['$event'])
  handleMouseClick(event: any) {
    this.clicks = [];

    const el = document.getElementById('svgItem') as HTMLElement;
    const rect = el.getBoundingClientRect();

    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (!this.isDrawing && event.target === this.svg.node()) {
      this.svg.selectAll('rect').remove();

      this.startX = x;
      this.startY = y;

      this.rect = this.svg
        .append('rect')
        .attr('x', this.startX)
        .attr('y', this.startY)
        .attr('width', 0)
        .attr('height', 0)
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '4')
        .attr('fill', 'transparent');
      this.isDrawing = true;
    }

    if (this.image) {
      const imageScale = this.image.width / el.clientWidth;
      x *= imageScale;
      y *= imageScale;

      this.clicks.push({ x, y, clickType: 2 });
    }
  }

  @HostListener('mouseup', ['$event'])
  handleMouseUp(event: any) {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.rect.attr('stroke-dasharray', 'none');
    }

    // const el = event.target as HTMLElement;
    const el = document.getElementById('svgItem') as HTMLElement;
    const rect = el.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (this.image) {
      const imageScale = this.image.width / el.clientWidth;

      x *= imageScale;
      y *= imageScale;

      // check if mouse move after mouse down
      if (this.startX !== x || this.startY !== y) {
        this.clicks.push({ x, y, clickType: 3 });
      }
      // this.clicks.push({ x, y, clickType: 0 });
      this.appContext.setClicks(this.clicks);
    }
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: any) {
    if (this.isDrawing) {
      let currentX = event.offsetX;
      let currentY = event.offsetY;
      this.rect
        .attr('width', Math.abs(currentX - this.startX))
        .attr('height', Math.abs(currentY - this.startY))
        .attr('x', currentX - this.startX > 0 ? this.startX : currentX)
        .attr('y', currentY - this.startY > 0 ? this.startY : currentY);
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { modelInputProps } from '../helpers/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AppContextService {
  constructor() {}
  private clicksSource = new BehaviorSubject<modelInputProps[] | null>(null);
  clicks$ = this.clicksSource.asObservable();

  private imageSource = new BehaviorSubject<HTMLImageElement | null>(null);
  image$ = this.imageSource.asObservable();

  private maskImgSource = new BehaviorSubject<HTMLImageElement | null>(null);
  maskImg$ = this.maskImgSource.asObservable();

  private polygonPoints: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  setClicks(clicks: modelInputProps[] | null): void {
    this.clicksSource.next(clicks);
  }

  setImage(image: HTMLImageElement | null): void {
    this.imageSource.next(image);
  }

  setMaskImg(maskImg: HTMLImageElement | null): void {
    this.maskImgSource.next(maskImg);
  }

  setPolygonPoints(points: any): void {
    this.polygonPoints.next(points);
  }

  getPolygonPoints(): Observable<any> {
    return this.polygonPoints.asObservable();
  }
}

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map: any;
  constructor() {}

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map', {
      center: [6.927079, 79.861244], // Example: Center of the US
      zoom: 10,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.addBubbles();
  }

  addBubbles(): void {
    interface Location {
      center: [number, number];
      radius: number;
      popup: string;
      color: string; // Add this line
    }

    // Then, when defining locations, TypeScript knows the shape of each object
    const locations: Location[] = [
      {
        center: [6.927079, 79.861244],
        radius: 9000,
        popup: 'Colombo',
        color: 'green',
      },
      {
        center: [5.95492, 80.555],
        radius: 6000,
        popup: 'Matara',
        color: 'red',
      },
      {
        center: [6.949717, 80.789107],
        radius: 12000,
        popup: 'Nuwara Eliya',
        color: 'orange',
      },
    ];

    locations.forEach((location) => {
      const circleOptions = {
        color: location.color, // Use the specific color for this location
        fillColor: location.color,
        fillOpacity: 0.5,
      };

      L.circle(
        location.center as [number, number],
        location.radius,
        circleOptions
      )
        .addTo(this.map)
        .bindPopup(location.popup);
    });
  }
}

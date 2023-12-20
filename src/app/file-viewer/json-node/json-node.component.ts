import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-json-node',
  templateUrl: './json-node.component.html',
  styleUrls: ['./json-node.component.scss'],
})
export class JsonNodeComponent implements OnInit {
  @Input() data: any;
  @Input() parentKey!: string;  
  @Input() isRoot: boolean = true; 
  public isCollapsed = true;

  constructor() {}

  ngOnInit(): void {}

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getObjectKeys(obj: any): string[] {
    if (typeof obj === 'string' || typeof obj !== 'object' || obj === null) {
      return [];
    }
    const keys = Object.keys(obj).filter(key => key !== '_isCollapsed');
    return keys;
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !this.isArray(value);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}

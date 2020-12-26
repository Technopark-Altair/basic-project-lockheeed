import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-element-preview',
  templateUrl: './element-preview.component.html',
  styleUrls: ['./element-preview.component.css']
})

export class ElementPreviewComponent {
  @Input('element') element: JSON;
}

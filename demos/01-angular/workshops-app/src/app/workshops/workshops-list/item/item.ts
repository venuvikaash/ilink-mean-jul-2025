import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import IWorkshop from '../../models/IWorkshop';

@Component({
  selector: 'app-item',
  imports: [
    RouterLink
  ],
  templateUrl: './item.html',
  styleUrl: './item.scss'
})
export class Item {
  @Input()
  workshop!: IWorkshop;
}

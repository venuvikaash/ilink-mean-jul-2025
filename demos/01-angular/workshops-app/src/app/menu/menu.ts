import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu',
  imports: [NgbModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  isNavbarCollapsed = true;
}

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu',
  imports: [NgbModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  isNavbarCollapsed = true;

  // routerLinkActiveOptions = { exact: true };
}

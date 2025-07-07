import { Component, inject, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/common/auth/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive, NgbDropdownModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  collapsed = true;
  isLoggedIn = false;

  authenticationService = inject(AuthenticationService);
  router = inject(Router);

  ngOnInit(): void {
    // we subscribe to be notified of changes in login status
    this.authenticationService.loggedInStatus$.subscribe(
      (isLoggedIn) => (this.isLoggedIn = isLoggedIn)
    );
  }

  logout(event: Event) {
    event.preventDefault();

    this.authenticationService.logout();

    this.router.navigateByUrl('/');
  }
}

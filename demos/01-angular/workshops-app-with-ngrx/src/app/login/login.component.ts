import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastService } from 'app/common/toast/toast.service';
import {
  AuthenticationService,
  ICredentials,
} from 'app/common/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  credentials: ICredentials = {
    email: 'john.doe@example.com',
    password: 'Password123#',
  };

  loading = false;
  returnUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.credentials).subscribe({
      next: (data) => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.toastService.show({
          templateOrMessage: error.message,
          classname: 'bg-danger text-light',
          delay: 2000,
        });

        this.loading = false;
      },
    });
  }
}

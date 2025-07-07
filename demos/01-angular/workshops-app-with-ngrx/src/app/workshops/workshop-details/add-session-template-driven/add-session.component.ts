import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SessionsService } from 'app/workshops/sessions.service';
import { ToastService } from 'app/common/toast/toast.service';

import ISession from 'app/workshops/models/ISession';

@Component({
  selector: 'app-add-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-session.component.html',
  styleUrl: './add-session.component.css',
})
export class AddSessionComponent {
  workshopIdStr!: string | null | undefined;
  workshopId: number | null = null;
  error: Error | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sessionsService: SessionsService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // we are in a child route and trying to access parent route's param id - hence .parent.snapshot
    // this.id = +this._activatedRoute.parent?.snapshot?.paramMap?.get('id');

    this.workshopIdStr =
      this.activatedRoute.parent?.snapshot.paramMap.get('id');

    if (this.workshopIdStr) {
      this.workshopId = +this.workshopIdStr;
    }
  }

  addSession(
    event: Event,
    partialSession: Omit<ISession, 'id' | 'workshopId'>
  ) {
    // prevents browser default action of submitting the form
    event.preventDefault();

    if (this.workshopId) {
      const session = {
        ...partialSession,
        upvoteCount: 0,
        workshopId: this.workshopId,
      };

      this.sessionsService.addSession(session).subscribe({
        next: (session: Omit<ISession, 'id' | 'workshopId'>) => {
          this.toastService.show({
            templateOrMessage: `A new session - "${session.name}" has been added`,
            classname: 'bg-success text-light',
            delay: 2000,
          });

          // go back to sessions list
          this.router.navigateByUrl(`/workshops/${this.workshopId}`);
        },
        error: (error) => {
          this.error = error;

          this.toastService.show({
            templateOrMessage: `Could not add session - "${session.name}"`,
            classname: 'bg-danger text-light',
            delay: 2000,
          });
        },
      });
    }
  }
}

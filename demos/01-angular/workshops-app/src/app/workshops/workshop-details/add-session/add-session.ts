import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Sessions } from '../../sessions';
import ISession from '../../models/ISession';

@Component({
  selector: 'app-add-session',
  imports: [
    RouterLink,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './add-session.html',
  styleUrl: './add-session.scss'
})
export class AddSession {
  constructor(
      private activatedRoute: ActivatedRoute,
      private sessionsService: Sessions,
      private router: Router
  ) {}

  addSession(addSessionForm : NgForm) {
    console.log( addSessionForm.value );

    const id = +(this.activatedRoute.snapshot.parent?.paramMap.get(
        'id'
    ) as string);

    const newSession = {
      ...addSessionForm.value,
      workshopId: id,
      upvoteCount: 0,
      sequenceId: +addSessionForm.value.sequenceId,
      duration: +addSessionForm.value.duration,
    } as Omit<ISession, 'id'>;

    console.log(newSession);

    this.sessionsService.addSession(newSession).subscribe({
        next: (addedSession) => {
            alert(`Added session with id = ${addedSession.id}`);

            // You can also use navigateByUrl()
            this.router.navigate(['/workshops', id]);
        },
    });
  }
}

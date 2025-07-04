import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  NgForm,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Sessions } from '../../sessions';
import ISession from '../../models/ISession';
import { Toast as ToastService } from '../../../common/toast';

@Component({
  selector: 'app-add-session',
  imports: [RouterLink, ReactiveFormsModule, JsonPipe],
  templateUrl: './add-session.html',
  styleUrl: './add-session.scss',
})
export class AddSession {
    addSessionForm: FormGroup;

    // helper accessor methods
    get sequenceId() {
        return this.addSessionForm.get('sequenceId') as FormControl
    }

    get name() {
        return this.addSessionForm.get('name') as FormControl;
    }

    get speaker() {
        return this.addSessionForm.get('speaker') as FormControl;
    }

    get duration() {
        return this.addSessionForm.get('duration') as FormControl;
    }

    get level() {
        return this.addSessionForm.get('level') as FormControl;
    }

    get abstract() {
        return this.addSessionForm.get('abstract') as FormControl;
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private sessionsService: Sessions,
        private router: Router,
        private toastService: ToastService,
        private fb: FormBuilder,
    ) {
        this.addSessionForm = this.fb.group(
            {
                sequenceId: [
                    // initial input value
                    '',
                    [
                        // the list of validators
                        Validators.required,
                        Validators.pattern('\\d+'),
                    ],
                ],
                name: [
                    '',
                    [Validators.required, Validators.pattern('[A-Z][A-Za-z ]+')],
                ],
                speaker: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('[A-Z][A-Za-z ]+(,[A-Z ][A-Za-z ]+)*'),
                    ],
                ],
                duration: [
                    '',
                    [Validators.required, Validators.min(0.5), Validators.max(10)],
                ],
                level: [
                    '',
                    [Validators.required]
                ],
                abstract: [
                    '',
                    [Validators.required, Validators.minLength(20)],
                ],
            }
        );
    }

  addSession() {
    const addSessionForm = this.addSessionForm;

    console.log(addSessionForm.value);

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
        this.toastService.add({
          message: `Added session with id = ${addedSession.id}`,
          className: 'bg-success text-light',
          duration: 5000,
        });

        // You can also use navigateByUrl()
        this.router.navigate(['/workshops', id]);
      },
      error: (error) => {
        this.toastService.add({
          message: `Unable to add the session - ${error.message}`,
          className: 'bg-danger text-light',
          duration: 5000,
        });
      },
    });
  }
}

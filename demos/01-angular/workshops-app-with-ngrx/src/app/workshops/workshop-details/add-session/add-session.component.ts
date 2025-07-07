import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SessionsService } from 'app/workshops/sessions.service';
import { ToastService } from 'app/common/toast/toast.service';

import ISession from 'app/workshops/models/ISession';
import { FormValidatorsService } from 'app/common/form-validators.service';

export interface NonNullableAbstractControl extends AbstractControl {
  errors: ValidationErrors;
}

function sessionDurationAndLevel(form: AbstractControl) {
  const strDuration = form.get('duration')?.value;
  const duration = parseFloat(strDuration);
  const level = form.get('level')?.value;

  // console.log(form);
  console.log(duration, level);

  // we consider the validation as passed if one of the fields is still not filled
  if (strDuration === '' || level === '') {
    return null;
  }

  if (level === 'Basic' && duration > 1) {
    return {
      sessionDurationAndLevel: true,
      sessionDurationAndLevelErrorMessage:
        'Sessions at a Basic level must not exceed 1 hour duration',
    };
  }

  if (level === 'Intermediate' && duration > 2) {
    return {
      sessionDurationAndLevel: true,
      sessionDurationAndLevelErrorMessage:
        'Sessions at an Intermediate level must not exceed 2 hours duration',
    };
  }

  return null;
}

@Component({
  selector: 'app-add-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-session.component.html',
  styleUrl: './add-session.component.css',
})
export class AddSessionComponent {
  workshopIdStr!: string | null | undefined;
  workshopId: number | null = null;
  error: Error | null = null;

  form!: FormGroup;

  // accessor method
  get sequenceId() {
    return this.form.get('sequenceId') as AbstractControl;
  }

  get name() {
    return this.form.get('name') as AbstractControl;
  }

  get speaker() {
    return this.form.get('speaker') as AbstractControl;
  }

  get duration() {
    return this.form.get('duration') as AbstractControl;
  }

  get level() {
    return this.form.get('level') as AbstractControl;
  }

  get abstract() {
    return this.form.get('abstract') as AbstractControl;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private formValidatorsService: FormValidatorsService,
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

    this.form = this.fb.group(
      {
        sequenceId: [
          '',
          [
            Validators.required,
            Validators.pattern('^[1-9][0-9]*$'), // Positive integer validation
          ],
        ],
        name: [
          '',
          [
            Validators.required,
            Validators.pattern('^[A-Za-z ]+$'), // Alphabet letters and spaces
          ],
        ],
        speaker: [
          '',
          [
            Validators.required,
            Validators.pattern('^[A-Za-z ,]+$'), // Alphabet letters, spaces, and commas
            this.formValidatorsService.csv(3),
          ],
        ],
        duration: ['', Validators.required],
        level: ['', Validators.required],
        abstract: [
          '',
          [
            Validators.required,
            Validators.minLength(20), // Minimum length for level selection,
          ],
        ],
      },
      { validators: sessionDurationAndLevel }
    );
  }

  // Type Predicates in TypeScript: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
  isInvalid(
    formControl: AbstractControl
  ): formControl is NonNullableAbstractControl {
    return !!(
      formControl &&
      formControl.invalid &&
      (formControl.dirty || formControl.touched) &&
      formControl.errors
    );
  }

  addSession(event: Event) {
    // prevents browser default action of submitting the form
    event.preventDefault();

    if (this.workshopId) {
      const session = {
        ...this.form.value,
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

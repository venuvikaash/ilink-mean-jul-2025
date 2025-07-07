import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
  } from '@angular/forms';
import { WorkshopsService } from '../workshops';
import { Toast as ToastService } from '../../common/toast';

@Component({
    selector: 'app-add-workshop',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './add-workshop.html',
    styleUrl: './add-workshop.scss',
})
export class AddWorkshop {
    addWorkshopForm!: FormGroup;

    constructor(
        private fb : FormBuilder,
        private toastService: ToastService,
        private workshopsService: WorkshopsService,
        private router: Router
    ) {
        // EXERCISE: Create a FormGroup variable for the form. Group address, city, state under a separate FormGroup as "location". Group the 2 checkboxes under "modes". On submit of the form. Log the value of the form.
        this.addWorkshopForm = this.fb.group({
          name: ['', [Validators.required]],
          category: ['', [Validators.required]],
          description: ['', [Validators.required]],
          startDate: ['', [Validators.required]],
          endDate: ['', [Validators.required]],
          time: ['', [Validators.required]],
          location: this.fb.group({
              address: ['', Validators.required],
              city: ['', Validators.required],
              state: ['', Validators.required],
          }),
          modes: this.fb.group({
              inPerson: this.fb.control(false),
              online: this.fb.control(false),
          }),
          imageUrl: ['', [Validators.required]],
      });
    }

    addWorkshop() {
        console.log(this.addWorkshopForm.value);

        this.workshopsService
            .postWorkshop(this.addWorkshopForm.value)
            .subscribe({
                next: (workshop) => {
                    this.toastService.add({
                        message: `Successfully added workshop - ${workshop.name}`,
                        className: 'bg-success text-light',
                        duration: 5000,
                    });

                    this.router.navigateByUrl('/workshops');
                },
                error: (error) => {
                    this.toastService.add({
                        message: `Could not add workshop | ${error.message}`,
                        className: 'bg-danger text-light',
                        duration: 5000,
                    });
                },
            });
    }
}
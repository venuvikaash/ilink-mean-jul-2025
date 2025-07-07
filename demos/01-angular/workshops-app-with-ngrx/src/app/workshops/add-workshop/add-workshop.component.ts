import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService, ICountry, IState } from 'app/common/places.service';
import { WorskhopsService } from '../worskhops.service';
import { ToastService } from 'app/common/toast/toast.service';
import IWorkshop from '../models/IWorkshop';

export interface NonNullableAbstractControl extends AbstractControl {
  errors: ValidationErrors;
}

@Component({
  selector: 'app-add-workshop',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-workshop.component.html',
  styleUrl: './add-workshop.component.css',
})
export class AddWorkshopComponent implements OnInit {
  form!: FormGroup;
  countries: ICountry[] = [];
  states: IState[] | null | undefined = [];
  cities: string[] = [];

  isEdit: boolean = false;
  id!: number;

  loading = true;
  error: Error | null = null;
  workshop!: IWorkshop;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService,
    // private formValidatorsService: FormValidatorsService,
    private workshopsService: WorskhopsService,
    private toastService: ToastService
  ) {}

  getWorkshopById(id: number) {
    this.loading = true;

    // https://rxjs.dev/deprecations/subscribe-arguments
    this.workshopsService.getWorkshopById(id).subscribe({
      next: (fetchedWorkshop) => {
        // Get cities for ( country, state ) combination
        const {
          location: { country, state },
        } = fetchedWorkshop;

        this.states = this.states = this.countries.find(
          (country) => country.name === fetchedWorkshop.location.country
        )?.states;

        this.placesService
          .getCitiesByCountryAndState(country, state)
          .subscribe({
            next: (cities) => {
              this.cities = cities;

              this.workshop = fetchedWorkshop;
              this.loading = false;

              // transform dates format
              this.workshop.startDate = this.workshop.startDate.substring(
                0,
                10
              );
              this.workshop.endDate = this.workshop.endDate.substring(0, 10);

              setTimeout(() => {
                this.form.patchValue(this.workshop, {
                  emitEvent: false,
                });
              }, 1000);
            },
            error: (error) => {
              alert(error.message);
            },
          });
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  initializeForm() {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Za-z ]+$'), // Only letters and spaces
        ],
      ],
      category: ['', Validators.required],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20), // Minimum 20 characters
        ],
      ],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      time: ['', Validators.required],
      location: this.fb.group({
        country: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
        address: ['', Validators.required],
      }),
      // modes: this.fb.array([
      //   this.fb.control(false), // inPerson
      //   this.fb.control(false), // online
      // ]),
      modes: this.fb.group({
        inPerson: this.fb.control(false),
        online: this.fb.control(false),
      }),
      imageUrl: [
        '',
        [
          Validators.required,
          Validators.pattern('https?://.+'), // URL validation
        ],
      ],
    });

    // set up states to be populated when country changes
    this.country.valueChanges.subscribe({
      next: (newCountry: string) => {
        this.onCountryChange(newCountry);
      },
    });

    // set up cities to be populated when state changes
    this.state.valueChanges.subscribe({
      next: (newState: string) => {
        this.onStateChange(newState);
      },
    });
  }

  ngOnInit(): void {
    this.initializeForm();

    // Get countries and states
    this.placesService.getCountriesAndStates().subscribe({
      next: (countries) => {
        this.countries = countries;

        // TODO: Do not nest this API call - make it parallel with this API call - this.placesService.getCountriesAndStates()
        this.activatedRoute.paramMap.subscribe({
          next: (paramMap) => {
            const idStr = paramMap.get('id');

            if (idStr) {
              this.isEdit = true;
              this.id = +idStr;

              this.getWorkshopById(this.id);
            }
          },
        });
      },
      error: (error) => {
        alert(error.message);
      },
    });
  }

  // Accessor methods to get form controls easily
  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get category(): FormControl {
    return this.form.get('category') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get startDate(): FormControl {
    return this.form.get('startDate') as FormControl;
  }

  get endDate(): FormControl {
    return this.form.get('endDate') as FormControl;
  }

  get time(): FormControl {
    return this.form.get('time') as FormControl;
  }

  get location(): FormGroup {
    return this.form.get('location') as FormGroup;
  }

  get address(): FormControl {
    return this.form.get('address') as FormControl;
  }

  get city(): FormControl {
    // NOTE: This is this.location.get() and NTO this.form.get()
    return this.location.get('city') as FormControl;
  }

  get state(): FormControl {
    return this.location.get('state') as FormControl;
  }

  get country(): FormControl {
    return this.location.get('country') as FormControl;
  }

  get modes(): FormGroup {
    return this.form.get('modes') as FormGroup;
  }

  get inPerson(): FormControl {
    return this.modes.get('inPerson') as FormControl;
  }

  get online(): FormControl {
    return this.modes.get('online') as FormControl;
  }

  get imageUrl(): FormControl {
    return this.form.get('imageUrl') as FormControl;
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

  onCountryChange(newCountry: string) {
    console.log(newCountry);

    if (newCountry === '') {
      this.states = [];
      return;
    }

    this.states = this.countries.find(
      (country) => country.name === newCountry
    )?.states;
  }

  onStateChange(newState: string) {
    if (this.country.value === '' || this.state.value === '') {
      this.states = [];
      return;
    }

    // Get cities for ( country, state ) combination
    this.placesService
      .getCitiesByCountryAndState(this.country.value, newState)
      .subscribe({
        next: (cities) => {
          this.cities = cities;
        },
        error: (error) => {
          alert(error.message);
        },
      });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEdit) {
        this.workshopsService.putWorkshop(this.id, this.form.value).subscribe({
          next: (workshop) => {
            this.toastService.show({
              templateOrMessage: `Workshop - "${workshop.name}" has been updated`,
              classname: 'bg-success text-light',
              delay: 2000,
            });

            // go back to sessions list
            this.router.navigateByUrl(`/workshops`);
          },
          error: (error) => {
            this.toastService.show({
              templateOrMessage: `Could not update workshop - "${this.name}" | ${error.message}`,
              classname: 'bg-danger text-light',
              delay: 2000,
            });
          },
        });
      } else {
        this.workshopsService.postWorkshop(this.form.value).subscribe({
          next: (workshop) => {
            this.toastService.show({
              templateOrMessage: `A new workshop - "${workshop.name}" has been added`,
              classname: 'bg-success text-light',
              delay: 2000,
            });

            // go back to sessions list
            this.router.navigateByUrl(`/workshops`);
          },
          error: (error) => {
            this.toastService.show({
              templateOrMessage: `Could not add workshop - "${this.name}" | ${error.message}`,
              classname: 'bg-danger text-light',
              delay: 2000,
            });
          },
        });
      }
    }
  }
}

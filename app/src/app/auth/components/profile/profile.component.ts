import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { selectCurrentUser } from '../../store/auth.selectors';
import * as AuthActions from '../../store/auth.actions';

@Component({
  selector: 'app-profile',
  template: `
    <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div class="bg-white shadow rounded-lg" *ngIf="user$ | async as user">
        <!-- Profile Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <img 
                [src]="user.profileImage || 'assets/default-avatar.png'" 
                class="h-20 w-20 rounded-full object-cover"
                alt="Profile"
              />
              <label 
                class="absolute bottom-0 right-0 bg-green-600 p-1 rounded-full cursor-pointer hover:bg-green-700"
                [for]="'profile-image'"
              >
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </label>
              <input 
                id="profile-image"
                type="file"
                class="hidden"
                accept="image/*"
                (change)="onFileSelected($event)"
              />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ user.firstName }} {{ user.lastName }}</h2>
              <p class="text-sm text-gray-500">{{ user.role }}</p>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                formControlName="firstName"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p *ngIf="profileForm.get('firstName')?.errors?.['required'] && profileForm.get('firstName')?.touched"
                 class="mt-1 text-sm text-red-600">
                First name is required
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                formControlName="lastName"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p *ngIf="profileForm.get('lastName')?.errors?.['required'] && profileForm.get('lastName')?.touched"
                 class="mt-1 text-sm text-red-600">
                Last name is required
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                formControlName="email"
                type="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p *ngIf="profileForm.get('email')?.errors?.['required'] && profileForm.get('email')?.touched"
                 class="mt-1 text-sm text-red-600">
                Email is required
              </p>
              <p *ngIf="profileForm.get('email')?.errors?.['email'] && profileForm.get('email')?.touched"
                 class="mt-1 text-sm text-red-600">
                Please enter a valid email
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <input
                formControlName="phone"
                type="tel"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p *ngIf="profileForm.get('phone')?.errors?.['required'] && profileForm.get('phone')?.touched"
                 class="mt-1 text-sm text-red-600">
                Phone number is required
              </p>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <input
                formControlName="address"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p *ngIf="profileForm.get('address')?.errors?.['required'] && profileForm.get('address')?.touched"
                 class="mt-1 text-sm text-red-600">
                Address is required
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input
                formControlName="city"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p *ngIf="profileForm.get('city')?.errors?.['required'] && profileForm.get('city')?.touched"
                 class="mt-1 text-sm text-red-600">
                City is required
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Birth Date</label>
              <input
                formControlName="birthDate"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p *ngIf="profileForm.get('birthDate')?.errors?.['required'] && profileForm.get('birthDate')?.touched"
                 class="mt-1 text-sm text-red-600">
                Birth date is required
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between pt-6">
            <button
              type="button"
              (click)="confirmDelete()"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>

            <div class="flex space-x-3">
              <button
                type="button"
                (click)="resetForm()"
                class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Reset
              </button>
              <button
                type="submit"
                [disabled]="profileForm.invalid || !profileForm.dirty"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>

        <!-- Delete Confirmation Modal -->
        <div *ngIf="showDeleteModal" class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to delete your account? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  (click)="deleteAccount()"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  (click)="showDeleteModal = false"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user$: Observable<User | null>;
  showDeleteModal = false;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.user$ = this.store.select(selectCurrentUser);
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required],
      profileImage: ['']
    });
  }

  ngOnInit(): void {
    // Initialize form with current user data
    this.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          city: user.city,
          phone: user.phone,
          birthDate: user.birthDate,
          profileImage: user.profileImage
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Store the file path for local storage
      this.profileForm.patchValue({
        profileImage: file.path
      });
      this.profileForm.markAsDirty();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.profileForm.dirty) {
      this.user$.subscribe(user => {
        if (user) {
          const updatedUser: User = {
            ...user,
            ...this.profileForm.value
          };
          this.store.dispatch(AuthActions.updateProfile({ user: updatedUser }));
        }
      });
    }
  }

  resetForm(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          city: user.city,
          phone: user.phone,
          birthDate: user.birthDate,
          profileImage: user.profileImage
        });
      }
    });
    this.profileForm.markAsPristine();
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  deleteAccount(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.store.dispatch(AuthActions.deleteAccount({ userId: user.id }));
      }
    });
  }
} 
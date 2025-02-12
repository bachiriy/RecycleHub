import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { BaseComponent } from '../../shared/components/base.component';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import * as CollectionActions from '../store/collection.actions';

@Component({
  selector: 'app-new-collection',
  standalone: false,
  template: `
    <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6">New Collection Request</h2>
        
        <form [formGroup]="collectionForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Waste Items -->
          <div formArrayName="wasteItems">
            <div class="flex justify-between items-center mb-4">
              <label class="block text-lg font-medium">Waste Items</label>
              <button 
                type="button"
                (click)="addWasteItem()"
                class="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200"
                [disabled]="totalWeight >= 10000"
              >
                Add Item
              </button>
            </div>
            
            <div *ngFor="let item of wasteItems.controls; let i=index" 
                 [formGroupName]="i"
                 class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md mb-4">
              <div>
                <label class="block text-sm font-medium">Type</label>
                <select formControlName="type"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="PLASTIC">Plastic</option>
                  <option value="GLASS">Glass</option>
                  <option value="PAPER">Paper</option>
                  <option value="METAL">Metal</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium">Weight (g)</label>
                <input type="number"
                       formControlName="weight"
                       min="0"
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <p *ngIf="item.get('weight')?.errors?.['min']" 
                   class="mt-1 text-sm text-red-600">
                  Minimum weight is 1000g
                </p>
              </div>
              
              <button type="button"
                      (click)="removeWasteItem(i)"
                      class="col-span-2 text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          </div>

          <!-- Total Weight -->
          <div class="bg-gray-100 p-4 rounded-md">
            <p class="text-lg font-medium">Total Weight: {{ totalWeight }}g</p>
            <p *ngIf="totalWeight > 10000" class="text-red-600">
              Total weight cannot exceed 10kg (10,000g)
            </p>
          </div>

          <!-- Collection Details -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium">Collection Date</label>
              <input type="date"
                     formControlName="collectionDate"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                     [min]="minDate">
            </div>
            
            <div>
              <label class="block text-sm font-medium">Time Slot</label>
              <select formControlName="timeSlot"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="09:00-10:00">09:00-10:00</option>
                <option value="10:00-11:00">10:00-11:00</option>
                <option value="11:00-12:00">11:00-12:00</option>
                <option value="14:00-15:00">14:00-15:00</option>
                <option value="15:00-16:00">15:00-16:00</option>
                <option value="16:00-17:00">16:00-17:00</option>
                <option value="17:00-18:00">17:00-18:00</option>
              </select>
            </div>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium">Collection Address</label>
            <textarea formControlName="collectionAddress"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium">Notes (Optional)</label>
            <textarea formControlName="notes"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>

          <!-- Images -->
          <div>
            <label class="block text-sm font-medium">Images (Optional)</label>
            <input type="file"
                   multiple
                   accept="image/*"
                   (change)="onImagesSelected($event)"
                   class="mt-1 block w-full">
          </div>

          <!-- Submit -->
          <div class="flex justify-end space-x-3">
            <button type="button"
                    routerLink="/collections/my"
                    class="px-4 py-2 border rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
                    [disabled]="!collectionForm.valid || totalWeight > 10000 || totalWeight < 1000"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400">
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class NewCollectionComponent extends BaseComponent implements OnInit {
  collectionForm!: FormGroup;
  minDate = new Date().toISOString().split('T')[0];
  totalWeight: number = 0;
  
  get wasteItems() {
    return this.collectionForm.get('wasteItems') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    super();
    this.initForm();
  }

  private initForm(): void {
    this.collectionForm = this.fb.group({
      wasteItems: this.fb.array([]),
      collectionDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      collectionAddress: ['', Validators.required],
      notes: [''],
      images: [[]]
    });

    this.addWasteItem(); // Add first waste item by default
  }

  ngOnInit(): void {
    // Monitor waste items changes with debounce
    this.wasteItems.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.calculateTotalWeight();
    });
  }

  private calculateTotalWeight(): void {
    this.totalWeight = this.wasteItems.controls.reduce((total, control) => 
      total + (control.get('weight')?.value || 0), 0);
  }

  addWasteItem(): void {
    if (this.wasteItems.length >= 5) return;

    const wasteItem = this.fb.group({
      type: ['PLASTIC', Validators.required],
      weight: [0, [Validators.required, Validators.min(0), Validators.max(10000)]]
    });

    this.wasteItems.push(wasteItem);
  }

  removeWasteItem(index: number): void {
    if (this.wasteItems.length > 1) {
      this.wasteItems.removeAt(index);
    }
  }

  onImagesSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      const reader = new FileReader();
      const imagePaths: string[] = [];

      // Limit number of images
      const maxImages = Math.min(files.length, 3);
      
      for (let i = 0; i < maxImages; i++) {
        reader.readAsDataURL(files[i]);
        reader.onload = () => {
          imagePaths.push(reader.result as string);
          if (imagePaths.length === maxImages) {
            this.collectionForm.patchValue({ images: imagePaths });
          }
        };
      }
    }
  }

  onSubmit(): void {
    if (this.collectionForm.valid && this.totalWeight <= 10000 && this.totalWeight >= 1000) {
      const formValue = this.collectionForm.value;
      
      // Convert date string to Date object
      formValue.collectionDate = new Date(formValue.collectionDate);
      
      this.store.dispatch(CollectionActions.createCollection({ 
        collection: formValue 
      }));
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    // Clear form data
    this.collectionForm.reset();
  }
} 
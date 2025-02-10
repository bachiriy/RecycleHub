import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { selectCurrentUser } from '../auth/store/auth.selectors';
import * as PointsActions from './store/points.actions';

@Component({
  selector: 'app-points',
  template: `
    <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6">My Points: {{ (currentUser$ | async)?.points || 0 }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let voucher of vouchers" 
               class="border rounded-lg p-4 text-center">
            <h3 class="text-xl font-semibold">{{ voucher.points }} Points</h3>
            <p class="text-green-600 text-2xl font-bold">{{ voucher.value }} Dh</p>
            <button 
              (click)="redeemPoints(voucher.points, voucher.value)"
              [disabled]="(currentUser$ | async)?.points < voucher.points"
              class="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              Redeem
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PointsComponent {
  currentUser$ = this.store.select(selectCurrentUser);
  
  vouchers = [
    { points: 100, value: 50 },
    { points: 200, value: 120 },
    { points: 500, value: 350 }
  ];

  constructor(private store: Store) {}

  redeemPoints(points: number, value: number): void {
    this.store.dispatch(PointsActions.redeemPoints({ points, value }));
  }
} 
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  redeemPoints(userId: string, pointsToRedeem: number): Observable<number> {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }

    const user = users[userIndex];
    if (!user.points || user.points < pointsToRedeem) {
      return throwError(() => new Error('Insufficient points'));
    }

    user.points -= pointsToRedeem;
    users[userIndex] = user;
    localStorage.setItem('users', JSON.stringify(users));
    
    return of(user.points);
  }
} 
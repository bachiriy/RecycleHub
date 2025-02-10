import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectCurrentUser } from '../store/auth.selectors';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRole = route.data['role'];
    
    return this.store.select(selectCurrentUser).pipe(
      map((user: User | null) => {
        if (!user || user.role !== requiredRole) {
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    );
  }
} 
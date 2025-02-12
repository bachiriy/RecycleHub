import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      mergeMap(({ user }) =>
        this.authService.updateUser(user).pipe(
          map(updatedUser => AuthActions.updateProfileSuccess({ user: updatedUser })),
          catchError(error => of(AuthActions.updateProfileFailure({ error: error.message })))
        )
      )
    )
  );

  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.deleteAccount),
      mergeMap(({ userId }) =>
        this.authService.deleteUser(userId).pipe(
          map(() => AuthActions.deleteAccountSuccess()),
          catchError(error => of(AuthActions.deleteAccountFailure({ error: error.message })))
        )
      )
    )
  );

  deleteAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.deleteAccountSuccess),
      tap(() => this.router.navigate(['/auth/login']))
    ),
    { dispatch: false }
  );


  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((u) => u !== null ? AuthActions.loginSuccess({user: u}) : AuthActions.loginFailure({error: 'login failer.'})),
          catchError(error => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ user }) =>
        this.authService.checkUserExists(user.email).pipe(
          mergeMap(exists => {
            if (exists) {
              return of(AuthActions.registerFailure({ error: 'User with this email already exists' }));
            }
            return this.authService.register(user).pipe(
              map((u) => u !== null ? AuthActions.registerSuccess({user: u}) : AuthActions.registerFailure({error: 'Registration failed'})),
              catchError(error => of(AuthActions.registerFailure({ error: error.message })))
            );
          })
        )
      )
    )
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => {
        this.router.navigate(['/auth/login']);
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.logout();
        return this.router.navigate(['/auth/login'])
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
} 
import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  auth: boolean
}

export const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('currentUser') || 'null'),
  loading: false,
  error: null,
  auth: !!localStorage.getItem('currentUser')
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user }) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return {
      ...state,
      user,
      loading: false,
      error: null,
      auth: true
    };
  }),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.registerSuccess, (state, { user }) => ({
    ...state,
    user: null,
    loading: false,
    error: null,
    auth: false
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.logout, (state) => {
    localStorage.removeItem('currentUser');
    return initialState;
  }),
  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    auth: false
  })),
  on(AuthActions.deleteAccountSuccess, () => initialState),
  on(AuthActions.deleteAccountFailure, (state, { error }) => ({
    ...state,
    error,
    auth: false
  }))
); 
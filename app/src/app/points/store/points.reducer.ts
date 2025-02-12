import { createReducer, on } from '@ngrx/store';
import { PointsState, initialState } from './points.state';
import * as PointsActions from './points.actions';

export const pointsReducer = createReducer(
  initialState,

  // Handle redeemPoints action
  on(PointsActions.redeemPoints, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Handle redeemPointsSuccess action
  on(PointsActions.redeemPointsSuccess, (state, { points }) => ({
    ...state,
    remainingPoints: points,
    loading: false,
    error: null,
  })),

  // Handle redeemPointsFailure action
  on(PointsActions.redeemPointsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
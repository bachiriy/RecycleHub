import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PointsState } from './points.state';

export const selectPointsState = createFeatureSelector<PointsState>('points');

export const selectRemainingPoints = createSelector(
  selectPointsState,
  (state) => state.remainingPoints
);

export const selectPointsLoading = createSelector(
  selectPointsState,
  (state) => state.loading
);

export const selectPointsError = createSelector(
  selectPointsState,
  (state) => state.error
);
import { createAction, props } from '@ngrx/store';

export const redeemPoints = createAction(
  '[Points] Redeem Points',
  props<{ points: number; value: number }>()
);

export const redeemPointsSuccess = createAction(
  '[Points] Redeem Points Success',
  props<{ points: number }>()
);

export const redeemPointsFailure = createAction(
  '[Points] Redeem Points Failure',
  props<{ error: string }>()
); 
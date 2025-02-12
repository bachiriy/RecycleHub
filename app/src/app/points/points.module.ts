import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PointsComponent } from './points.component';
import { pointsReducer } from './store/points.reducer';
import { PointsEffects } from './store/points.effects';

@NgModule({
  declarations: [PointsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: PointsComponent }]),
    StoreModule.forFeature('points', pointsReducer),
    EffectsModule.forFeature([PointsEffects])
  ]
})
export class PointsModule { } 
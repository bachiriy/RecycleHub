import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MyCollectionsComponent } from './my-collections/my-collections.component';
import { AvailableCollectionsComponent } from './available-collections/available-collections.component';
import { collectionReducer } from './store/collection.reducer';
import { CollectionEffects } from './store/collection.effects';
import { ReactiveFormsModule } from '@angular/forms';
import { NewCollectionComponent } from './new-collection/new-collection.component';

@NgModule({
  declarations: [
    MyCollectionsComponent,
    AvailableCollectionsComponent,
    NewCollectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    StoreModule.forFeature('collections', collectionReducer),
    EffectsModule.forFeature([CollectionEffects])
  ]
})
export class CollectionsModule { } 
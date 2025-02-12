import { createAction, props } from '@ngrx/store';
import { CollectionRequest } from '../../models/collection-request.model';

export const loadUserCollections = createAction(
  '[Collection] Load User Collections'
);

export const loadUserCollectionsSuccess = createAction(
  '[Collection] Load User Collections Success',
  props<{ collections: CollectionRequest[] }>()
);

export const loadAvailableCollections = createAction(
  '[Collection] Load Available Collections',
  props<{ city: string }>()
);

export const loadAvailableCollectionsSuccess = createAction(
  '[Collection] Load Available Collections Success',
  props<{ collections: CollectionRequest[] }>()
);

export const acceptCollection = createAction(
  '[Collection] Accept Collection',
  props<{ collectionId: string; collectorId: string }>()
);

export const acceptCollectionSuccess = createAction(
  '[Collection] Accept Collection Success',
  props<{ collection: CollectionRequest }>()
);

export const deleteCollectionRequest = createAction(
  '[Collection] Delete Collection Request',
  props<{ id: string }>()
);

export const deleteCollectionRequestSuccess = createAction(
  '[Collection] Delete Collection Request Success',
  props<{ id: string }>()
);

export const loadCollectionsFailure = createAction(
  '[Collection] Load Collections Failure',
  props<{ error: string }>()
);

export const acceptCollectionFailure = createAction(
  '[Collection] Accept Collection Failure',
  props<{ error: string }>()
);

export const deleteCollectionFailure = createAction(
  '[Collection] Delete Collection Failure',
  props<{ error: string }>()
);

export const createCollection = createAction(
  '[Collection] Create Collection',
  props<{ collection: Omit<CollectionRequest, 'id' | 'status' | 'createdAt'> }>()
);

export const createCollectionSuccess = createAction(
  '[Collection] Create Collection Success',
  props<{ collection: CollectionRequest }>()
);

export const createCollectionFailure = createAction(
  '[Collection] Create Collection Failure',
  props<{ error: string }>()
); 
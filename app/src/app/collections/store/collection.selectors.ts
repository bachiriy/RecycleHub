import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionState, collectionAdapter } from './collection.state';

export const selectCollectionState = createFeatureSelector<CollectionState>('collections');

const { selectAll } = collectionAdapter.getSelectors();

export const selectAllCollections = createSelector(
  selectCollectionState,
  selectAll
);

export const selectUserCollections = createSelector(
  selectAllCollections,
  selectCurrentUser,
  (collections, user) => collections.filter(c => c.userId === user?.id)
);

export const selectPendingRequestsCount = createSelector(
  selectCollectionState,
  state => state.pendingRequestsCount
);

export const selectAvailableCollections = createSelector(
  selectAllCollections,
  selectCurrentUser,
  (collections, user) => collections.filter(c => 
    c.status === 'PENDING' && 
    !c.collectorId && 
    c.collectionAddress.includes(user?.city || '')
  )
);

export const selectCollectionLoading = createSelector(
  selectCollectionState,
  state => state.loading
);

export const selectCollectionError = createSelector(
  selectCollectionState,
  state => state.error
); 
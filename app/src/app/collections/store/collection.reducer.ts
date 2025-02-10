import { createReducer, on } from '@ngrx/store';
import { collectionAdapter, initialState } from './collection.state';
import * as CollectionActions from './collection.actions';

export const collectionReducer = createReducer(
  initialState,
  
  // Load User Collections
  on(CollectionActions.loadUserCollections, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CollectionActions.loadUserCollectionsSuccess, (state, { collections }) => {
    const pendingCount = collections.filter(c => c.status === 'PENDING').length;
    return collectionAdapter.setAll(collections, {
      ...state,
      loading: false,
      pendingRequestsCount: pendingCount
    });
  }),

  // Load Available Collections
  on(CollectionActions.loadAvailableCollections, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CollectionActions.loadAvailableCollectionsSuccess, (state, { collections }) =>
    collectionAdapter.setAll(collections, {
      ...state,
      loading: false
    })
  ),

  // Accept Collection
  on(CollectionActions.acceptCollectionSuccess, (state, { collection }) =>
    collectionAdapter.updateOne(
      { id: collection.id, changes: collection },
      state
    )
  ),

  // Delete Collection
  on(CollectionActions.deleteCollectionRequestSuccess, (state, { id }) =>
    collectionAdapter.removeOne(id, {
      ...state,
      pendingRequestsCount: state.pendingRequestsCount - 1
    })
  )
); 
import { createReducer, on } from '@ngrx/store';
import { collectionAdapter, initialState } from './collection.state';
import * as CollectionActions from './collection.actions';

export const collectionReducer = createReducer(
  initialState,

  // Load User Collections
  on(CollectionActions.loadUserCollections, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CollectionActions.loadUserCollectionsSuccess, (state, { collections }) => {
    const pendingCount: number = collections.filter((c) => c.status === 'PENDING').length;
    return collectionAdapter.setAll(collections, {
      ...state,
      loading: false,
      pendingRequestsCount: pendingCount,
    });
  }),

  // Load Available Collections
  on(CollectionActions.loadAvailableCollections, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CollectionActions.loadAvailableCollectionsSuccess, (state, { collections }) =>
    collectionAdapter.setAll(collections, {
      ...state,
      loading: false,
    })
  ),

  // Accept Collection
  on(CollectionActions.acceptCollectionSuccess, (state, { collection }) => {
    const updatedState = collectionAdapter.updateOne(
      { id: collection.id, changes: collection },
      state
    );

    // If the collection status was changed from 'PENDING' to something else, decrement the count
    const previousCollection = state.entities[collection.id];
    if (previousCollection?.status === 'PENDING' && collection.status !== 'PENDING') {
      return {
        ...updatedState,
        pendingRequestsCount: state.pendingRequestsCount - 1,
      };
    }

    return updatedState;
  }),

  // Delete Collection
  on(CollectionActions.deleteCollectionRequestSuccess, (state, { id }) => {
    const collection = state.entities[id];
    const newPendingCount =
      collection?.status === 'PENDING' ? state.pendingRequestsCount - 1 : state.pendingRequestsCount;

    return collectionAdapter.removeOne(id, {
      ...state,
      pendingRequestsCount: newPendingCount,
    });
  }),

  // Create Collection
  on(CollectionActions.createCollectionSuccess, (state, { collection }) => {
    const newPendingCount =
      collection.status === 'PENDING' ? state.pendingRequestsCount + 1 : state.pendingRequestsCount;

    return collectionAdapter.addOne(collection, {
      ...state,
      pendingRequestsCount: newPendingCount,
    });
  }),

  // Handle Failures
  on(
    // CollectionActions.loadUserCollectionsFailure,
    // CollectionActions.loadAvailableCollectionsFailure,
    CollectionActions.acceptCollectionFailure,
    CollectionActions.deleteCollectionFailure,
    CollectionActions.createCollectionFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  )
);
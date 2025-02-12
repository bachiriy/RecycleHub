import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { CollectionRequest } from '../../models/collection-request.model';

export interface CollectionState extends EntityState<CollectionRequest> {
  pendingRequestsCount: number;
  loading: boolean;
  error: string | null;
}

export const collectionAdapter = createEntityAdapter<CollectionRequest>({
  selectId: (collection) => collection.id,
});

export const initialState: CollectionState = collectionAdapter.getInitialState({
  pendingRequestsCount: 0,
  loading: false,
  error: null,
});
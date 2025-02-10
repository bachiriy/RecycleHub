import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { CollectionRequest } from '../../models/collection-request.model';

export interface CollectionState extends EntityState<CollectionRequest> {
  loading: boolean;
  error: string | null;
  pendingRequestsCount: number;
}

export const collectionAdapter = createEntityAdapter<CollectionRequest>();

export const initialState: CollectionState = collectionAdapter.getInitialState({
  loading: false,
  error: null,
  pendingRequestsCount: 0
}); 
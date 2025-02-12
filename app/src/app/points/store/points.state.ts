export interface PointsState {
    remainingPoints: number | null;
    loading: boolean;
    error: string | null;
  }
  
  export const initialState: PointsState = {
    remainingPoints: null,
    loading: false,
    error: null,
  };
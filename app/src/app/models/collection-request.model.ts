export interface WasteItem {
  type: 'PLASTIC' | 'GLASS' | 'PAPER' | 'METAL';
  weight: number;
}

export interface CollectionRequest {
  id: string;
  userId: string;
  wasteItems: WasteItem[];
  totalWeight: number;
  images?: string[];
  collectionAddress: string;
  collectionDate: Date;
  timeSlot: string;
  notes?: string;
  status: 'PENDING' | 'OCCUPIED' | 'IN_PROGRESS' | 'VALIDATED' | 'REJECTED';
  collectorId?: string;
  realWeight?: number;
  collectionImages?: string[];
  createdAt: Date;
} 
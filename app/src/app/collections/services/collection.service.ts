import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CollectionRequest } from '../../models/collection-request.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private readonly COLLECTIONS_KEY = 'collections';

  constructor() {
    // Initialize with empty array if no collections exist
    if (!localStorage.getItem(this.COLLECTIONS_KEY)) {
      localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify([]));
    }
  }

  getUserCollections(userId: string): Observable<CollectionRequest[]> {
    const collections = this.getAllCollections();
    return of(collections.filter(c => c.userId === userId));
  }

  getAvailableCollections(city: string): Observable<CollectionRequest[]> {
    const collections = this.getAllCollections();
    return of(collections.filter(c => 
      c.status === 'PENDING' && 
      !c.collectorId && 
      c.collectionAddress.includes(city)
    ));
  }

  createCollection(collection: Omit<CollectionRequest, 'id' | 'status' | 'createdAt'>): Observable<CollectionRequest> {
    const collections = this.getAllCollections();
    const newCollection: CollectionRequest = {
      ...collection,
      id: Date.now().toString(),
      status: 'PENDING',
      createdAt: new Date()
    };
    
    collections.push(newCollection);
    this.saveCollections(collections);
    return of(newCollection);
  }

  updateCollection(collection: CollectionRequest): Observable<CollectionRequest> {
    const collections = this.getAllCollections();
    const index = collections.findIndex(c => c.id === collection.id);
    if (index !== -1) {
      collections[index] = collection;
      this.saveCollections(collections);
    }
    return of(collection);
  }

  deleteCollection(id: string): Observable<boolean> {
    const collections = this.getAllCollections();
    const filteredCollections = collections.filter(c => c.id !== id);
    this.saveCollections(filteredCollections);
    return of(true);
  }

  acceptCollection(collectionId: string, collectorId: string): Observable<CollectionRequest> {
    const collections = this.getAllCollections();
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      collection.status = 'OCCUPIED';
      collection.collectorId = collectorId;
      this.saveCollections(collections);
      return of(collection);
    }
    throw new Error('Collection not found');
  }

  updateCollectionStatus(id: string, status: 'IN_PROGRESS' | 'VALIDATED' | 'REJECTED', data?: {
    realWeight?: number;
    collectionImages?: string[];
  }): Observable<CollectionRequest> {
    const collections = this.getAllCollections();
    const collection = collections.find(c => c.id === id);
    if (collection) {
      collection.status = status;
      if (data) {
        Object.assign(collection, data);
        if (status === 'VALIDATED') {
          this.calculateAndAddPoints(collection);
        }
      }
      this.saveCollections(collections);
      return of(collection);
    }
    throw new Error('Collection not found');
  }

  private calculateAndAddPoints(collection: CollectionRequest): void {
    const pointsMap = {
      'PLASTIC': 2,
      'GLASS': 1,
      'PAPER': 1,
      'METAL': 5
    };

    const totalPoints = collection.wasteItems.reduce((points, item) => {
      return points + (pointsMap[item.type] * (item.weight / 1000)); // Convert g to kg
    }, 0);

    // Update user points
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === collection.userId);
    if (userIndex !== -1) {
      users[userIndex].points = (users[userIndex].points || 0) + totalPoints;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  private getAllCollections(): CollectionRequest[] {
    return JSON.parse(localStorage.getItem(this.COLLECTIONS_KEY) || '[]');
  }

  private saveCollections(collections: CollectionRequest[]): void {
    localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
  }
} 
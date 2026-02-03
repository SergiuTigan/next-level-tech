import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  DocumentData,
  QueryConstraint,
  Timestamp
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  readonly firestore = inject(Firestore);
  readonly storage = inject(Storage);

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Get all documents from a collection
   */
  async getAll<T>(collectionName: string, ...queryConstraints: QueryConstraint[]): Promise<T[]> {
    this.setLoading(true);
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const q = query(collectionRef, ...queryConstraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        _id: doc.id, // Backward compatibility
        ...this.convertTimestamps(doc.data())
      } as T));
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get a single document by ID
   */
  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    this.setLoading(true);
    try {
      const docRef = doc(this.firestore, collectionName, id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return {
        id: snapshot.id,
        _id: snapshot.id, // Backward compatibility
        ...this.convertTimestamps(snapshot.data())
      } as T;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Create a new document
   */
  async create<T>(collectionName: string, data: Partial<T>): Promise<T> {
    this.setLoading(true);
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return {
        id: docRef.id,
        _id: docRef.id,
        ...data
      } as T;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Update a document
   */
  async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<T> {
    this.setLoading(true);
    try {
      const docRef = doc(this.firestore, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      } as DocumentData);
      const updated = await this.getById<T>(collectionName, id);
      return updated as T;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Delete a document
   */
  async delete(collectionName: string, id: string): Promise<void> {
    this.setLoading(true);
    try {
      const docRef = doc(this.firestore, collectionName, id);
      await deleteDoc(docRef);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Upload a file to Firebase Storage
   */
  async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  /**
   * Delete a file from Firebase Storage
   */
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }

  /**
   * Convert Firestore Timestamps to ISO strings
   */
  private convertTimestamps(data: DocumentData): DocumentData {
    const result: DocumentData = {};
    for (const key of Object.keys(data)) {
      const value = data[key];
      if (value instanceof Timestamp) {
        result[key] = value.toDate().toISOString();
      } else if (Array.isArray(value)) {
        result[key] = value.map(item =>
          typeof item === 'object' && item !== null
            ? this.convertTimestamps(item)
            : item
        );
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.convertTimestamps(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
}

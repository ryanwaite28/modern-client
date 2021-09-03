import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { clone } from '../_misc/chamber';

export type StoreKey = number | string;

/**
 * Store Service
 * -------------
 *
 * This service is a light-weight app store solution
 * it has 2 maps:
 * - 1 for containing all of the app store values
 * - 1 for emiting changes to that key in the store
 */
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private storeMap = new Map<StoreKey, any>();
  private mainStream = new BehaviorSubject<any>(undefined);
  private keyStream = new Map<StoreKey, BehaviorSubject<any>>();

  constructor() { }

  select<T>(
    key: StoreKey, 
    createIfNotExists: boolean
  ): Observable<T | null> {
    const stream = <BehaviorSubject<T>> this.keyStream.get(key);
    if (!stream) {
      const message = `No entry found by key: ${key}`;
      // console.log(message);
      if (createIfNotExists) {
        const newStream = new BehaviorSubject<T | null>(null);
        this.keyStream.set(key, newStream);
        return newStream.asObservable();
      } else {
        throw new ReferenceError(message);
      }
    }
    const observable = <Observable<T>> stream.asObservable();
    return observable;
  }

  set(
    key: StoreKey,
    value: any
  ) {
    this.storeMap.set(key, value);
    const stream = <BehaviorSubject<any>> this.keyStream.get(key);
    if (stream) {
      stream.next(value);
    } else {
      this.mainStream.next(undefined);
    }
  }

  getStore(key: StoreKey) {
    const newMap = clone<Map<StoreKey, any>>(this.storeMap);
    if (key) {
      return newMap.get(key);
    }
    return newMap;
  }
}

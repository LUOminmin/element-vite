import { store } from 'src/index';
import { Action, StoreData } from 'src/store/types';
import { Store } from 'redux';

export class StoreService {
  protected store: Store<StoreData, Action>;

  constructor() {
    this.store = store;
  }

  protected getState(name: string): any {
    const value = this.store.getState()[name];
    return ['campus', 'building', 'floor'].includes(name)
      ? String(value)
      : value;
  }
}

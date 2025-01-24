import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

	constructor( private _storageService: Storage ) {
		this.init();
	}

	async init() {
		if (!this._storage) {
			const storage: Storage = await this._storageService.create();
			this._storage = storage;
		}
	}

	async set(key: string, value: any): Promise<any> {
		await this.init();
		return await this._storage?.set(key, value);
	}

	async get(key: string): Promise<any> {
		await this.init();
		return await this._storage?.get(key);
	}

	async remove(key: string): Promise<any> {
		await this.init();
		return await this._storage?.remove(key);
	}
}

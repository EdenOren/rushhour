import { Injectable } from "@angular/core";

export enum LocalStorageItems {
    GameCache = 'GameCache'
}

/**
 * A service for interacting with localStorage.
 * Data is stored in Base64 format to handle various data types and special characters.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Saves data to localStorage. The data is converted to a JSON string
   * and then encoded to Base64.
   * @param key The key to store the data under.
   * @param value The data to store. Can be any JSON-serializable type.
   */
  public setItem(key: LocalStorageItems, value: any): void {
    const jsonString: string = JSON.stringify(value);
    const encodedData: string = btoa(jsonString);
    localStorage.setItem(key, encodedData);
  }

  /**
   * Retrieves and decodes data from localStorage.
   * @param key The key of the data to retrieve.
   * @returns The retrieved data (parsed from JSON), or null if not found.
   */
  public getItem<T>(key: LocalStorageItems): T | null {
    const encodedData = localStorage.getItem(key);
    if (encodedData) {
        const jsonString = atob(encodedData);
        return JSON.parse(jsonString) as T;
    }
    return null;
  }

  /**
   * Removes an item from localStorage.
   * @param key The key of the item to remove.
   */
  public removeItem(key: LocalStorageItems): void {
    localStorage.removeItem(key);
  }
}
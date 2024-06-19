import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HashService {

  constructor() { }

  async generateHash(value: string): Promise<string> {
    const now = new Date().toISOString(); //Get date value
    const encoder = new TextEncoder();
    const data = encoder.encode(now);

    // Use a new SubtleCrypto instance to generate SHA-256 hash
    const subtleCrypto = crypto.subtle || (<any>crypto).webkitSubtle;
    const hashBuffer = await subtleCrypto.digest('SHA-256', data);

    // Convert the hash buffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }
}

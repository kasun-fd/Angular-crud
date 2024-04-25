import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {

  private characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  generateUniqueId() {
    const codes = [];
    for (let i = 0; i < 4; i++) {
      let code = '';
      for (let j = 0; j < 5; j++) {
        code += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      }
      codes.push(code);
    }
    return codes;
  }
}



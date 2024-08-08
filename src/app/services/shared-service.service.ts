import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private image = new BehaviorSubject<string>('');

  constructor() { }

  getImage() {
    return this.image.asObservable();
  }
  setImage(valor: string) {
    this.image.next(valor);
  }
}

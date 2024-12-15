import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Zone } from '../models/zone';
import { Mode } from '../models/mode';

@Injectable({
  providedIn: 'root'
})
export class ModeService {
  constructor() { }

  private readonly http : HttpClient = inject(HttpClient);

  //Metodo para obtener un array de todas las zonas en la api
  getAllZones() : Observable <Zone[]>{
    return this.http.get<Zone[]>("https://674531d6b4e2e04abea50775.mockapi.io/alarm-zones");
  }

  //metodo para guardar un nuevo modo
  addMode(mode : Mode) : Observable<Mode>{
    return this.http.post<Mode>("https://674531d6b4e2e04abea50775.mockapi.io/alarm-mode", mode);
  }

  //metodo para obtener los modos de un usuario por id
  getModesByUserId(userId : string): Observable<Mode[]>{
    return this.http.get<Mode[]>(`https://674531d6b4e2e04abea50775.mockapi.io/alarm-mode?userId=${userId}`)
  }
}

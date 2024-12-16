import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Zone } from '../models/zone';
import { Mode } from '../models/mode';
import { Status } from '../models/status';

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
  //lo uso para el async validator y para el panel
  getModesByUserId(userId : string): Observable<Mode[]>{
    return this.http.get<Mode[]>(`https://674531d6b4e2e04abea50775.mockapi.io/alarm-mode?userId=${userId}`)
  }

  //Metodo para cambiar el status de una alarma cuando se activa/desactiva
  changeStatus(newStatus : Status) : Observable<Status>{
    return this.http.post<Status>("https://6317ca93f6b281877c5d7785.mockapi.io/alarm-status", newStatus);
  }

  //metodo para obtener un array de todos los status de todas las alarmas, es para setear bien el boton de
  //armar o desarmar del panel
  getAllStatus() : Observable<Status[]>{
    return this.http.get<Status[]>("https://6317ca93f6b281877c5d7785.mockapi.io/alarm-status");
  }
}

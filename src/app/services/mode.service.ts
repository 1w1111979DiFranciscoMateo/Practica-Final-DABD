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

  //Para Inicializar el JSON Server. primero tiene que estar instalado en el proyecto
  //(npm install json-server)(te fijas en el package.json en la parte de dependencias) 
  //y despues para levantar el servidor tenes que ejecutar json-server --watch db.json 

  private readonly http : HttpClient = inject(HttpClient);

  //Metodo para obtener un array de todas las zonas en la api
  getAllZones() : Observable <Zone[]>{
    return this.http.get<Zone[]>("http://localhost:3000/zones");
  }

  //metodo para guardar un nuevo modo
  addMode(mode : Mode) : Observable<Mode>{
    return this.http.post<Mode>("http://localhost:3000/modes", mode);
  }

  //metodo para obtener los modos de un usuario por id
  //lo uso para el async validator y para el panel
  getModesByUserId(userId : string): Observable<Mode[]>{
    return this.http.get<Mode[]>(`http://localhost:3000/modes?userId=${userId}`)
  }

  //Metodo para cambiar el status de una alarma cuando se activa/desactiva
  changeStatus(newStatus : Status) : Observable<Status>{
    return this.http.post<Status>("http://localhost:3000/status", newStatus);
  }

  //metodo para obtener un array de todos los status de todas las alarmas, es para setear bien el boton de
  //armar o desarmar del panel
  getAllStatus() : Observable<Status[]>{
    return this.http.get<Status[]>("http://localhost:3000/status");
  }
}

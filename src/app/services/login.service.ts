import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor() { }

  //Injectamos el httpClient
  private readonly http : HttpClient = inject(HttpClient);

  //Seteamos un usuario vacio para manejar el tema del usuario que esta loggeado
  user : User | null = {
    email : '',
    password : '',
    id : ''
  };

  //Metodo para setear un usuario como el usuario que esta logeado actualmente
  setUserLogin(user : User){
    this.user = user;
  }

  //seteo el usuario logeado a null
  logout(){
    this.user = null;
  }

  //LLamada a la api para obtener todos los usuarios existentes
  getUsers() : Observable<User[]> {
    return this.http.get<User[]>("http://localhost:3000/users");
  }

}

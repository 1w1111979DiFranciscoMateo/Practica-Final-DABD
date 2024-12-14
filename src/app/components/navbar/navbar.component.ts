import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  //Injects
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  closeSession(){
    this.loginService.logout();
    alert("Sesión Cerrada!");
    this.router.navigate([""]);
  }
}

import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //Injectamos el router
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);

  //Formulario reactivo para el login
  loginForm = new UntypedFormGroup({
    userEmail : new UntypedFormControl("", [Validators.required, Validators.email]),
    userPassword : new UntypedFormControl("", [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/)])
  })

  //login al sistema
  login(){
    if(this.loginForm.valid){
      this.loginService.getUsers().subscribe((users) => {
        users.forEach((user) => {
          if(user.email == this.loginForm.value.userEmail && user.password == this.loginForm.value.userPassword){
            this.loginService.setUserLogin(user);
            alert("Logeado Correctamente!");
            this.router.navigate(["/panel"]);
          }
        })
      })
    }
  }
}

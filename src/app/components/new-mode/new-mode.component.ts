import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AbstractControl, AsyncValidatorFn, ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { Zone } from '../../models/zone';
import { User } from '../../models/user';
import { Mode } from '../../models/mode';
import { LoginService } from '../../services/login.service';
import { ModeService } from '../../services/mode.service';

@Component({
  selector: 'app-new-model',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './new-mode.component.html',
  styleUrl: './new-mode.component.css'
})
export class NewModeComponent implements OnInit, OnDestroy{
  
  ngOnInit(): void {
    //Cargamos el usuario logeado al objeto userLogeado para guardar el id del user que esta creando un modo
    //y le hacemos un patch value para que se actualize el valor
    this.userLogeado = this.loginService.user;
    this.form.patchValue({userId : this.userLogeado?.id});

    //aca llamamos al metodo que va a cargar los selects del formarray de zonas
    this.loadZones();
  }

  ngOnDestroy(): void {
    //Destruimos la subscription cuando no estamos en la pantalla
    this.subscription.unsubscribe();
  }

  //Creamos la subscripcion
  subscription = new Subscription();

  //Injects
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);
  private readonly modeService = inject(ModeService);

  //Array de Zonas para cargar el select dentro del formArray
  zonesArray : Zone[] = [];

  //Fecha actual
  today = new Date();

  //obtenemos el usuario logeado para cargar que usuario esta creando un nuevo modo
  userLogeado : User | null = {
    email : '',
    password : '',
    id : ''
  };

  //Formulario reactivo del nuevo modo
  form = new UntypedFormGroup({
    userId : new UntypedFormControl(this.userLogeado?.id),
    name : new UntypedFormControl("", [Validators.required, Validators.minLength(5)], [this.modeNameAsyncValidator(this.modeService, this.loginService)]),
    zones : new UntypedFormArray([], [this.uniqueZonesValidator]),
    creationDate : new UntypedFormControl(this.today)
    //el id se crea solo
  });

  //FormArray
  //Getter para acceder a las zonas en el formArray
  get zones(){
    return this.form.controls["zones"] as UntypedFormArray;
  }
  //Este metodo se llama cuando se agrega una nueva zona al modo, y crea un formulario para la zona
  //y despues este formulario se lo pasa al formArray
  onNewMode(){
    const formArray = this.form.controls["zones"] as UntypedFormArray;
    const zonesForm = new UntypedFormGroup({
      zone : new UntypedFormControl("", [Validators.required])
    });

    formArray.push(zonesForm);
  }

  //Metodo para eliminar una zona del formArray
  onDeleteZone(index : number){
    this.zones.removeAt(index);
  }

  //metodo para cargar las zonas al array zonesArray para el select del formArray
  loadZones(){
    const loadZonesSubscription = this.modeService.getAllZones().subscribe({
      next: (zones : Zone[]) => {
        this.zonesArray = zones;
      },
      error: (err) => {
        alert("Error al cargar array de zonas");
      }
    });
    this.subscription.add(loadZonesSubscription);
  }

  //Validator Sincronico (Sync) para el formArray, valida que solo se seleccionar la misma zona solo 1 vez
  uniqueZonesValidator(control : AbstractControl): ValidationErrors | null {
    if(!control || !control.value){
      return null;
    }
    //buscamos todas las zonas cargadas del form
    const zones = control.value.map((group : any) => group.zone);
    //chequeamos si hay duplicadas si hay devuelve true, si no devuelve false
    const hasDuplicates = zones.some((zone: Zone, index: number) => zones.indexOf(zone) !== index);
    //si hasDuplicates es true, devuelve un error de tipo uniqueZones, si es false devuelve null
    return hasDuplicates ? { uniqueZones : true } : null;
  }

  //Validator Asincronico (Async) para el nombre del modo, Valida que un usuario no pueda crear
  //un modo nuevo con el mismo nombre de un modo que este usuario ya creo en el pasado.
  modeNameAsyncValidator(modeService : ModeService, loginService : LoginService): AsyncValidatorFn{
    return (control : AbstractControl): Observable<ValidationErrors | null> => {
      //obtener el valor del nombre ingresado por el usuario
      const modeName = control.value;
      //obtener el id del usuario logeado
      const userId = loginService.user?.id;

      //si no hay nombre o no hay usuario logeado, no se hace la validacion
      if(!modeName || !userId){
        return of(null);
      }

      //Llamada a la api para verificar si un modo con este nombre ya existe para este usuario
      return modeService.getModesByUserId(userId).pipe(
        map((modes) => {
          //comprobamos si el modo ya existe para este usuario
          const modeExist = modes.some(mode => mode.name === modeName);
          //si ya existe devolvemos un error tipo modeNameTaken, si no devolvemos null
          return modeExist ? {modeNameTaken : true} : null;
        }),
        catchError(() => of(null))
      );
    }
  }

  //guardar el nuevo modo
  save(){
    if(this.form.invalid){
      alert("Formulario Invalido!");
      console.log(this.form.value);
      return;
    }
    const mode : Mode = this.form.value;
    const saveSubscription = this.modeService.addMode(mode).subscribe({
      next: () => {
        alert("Modo Creado Exitosamente!");
        this.router.navigate(['panel']);
      }, 
      error: (err) => {
        alert("Error al crear un Modo")
      }
    });
    this.subscription.add(saveSubscription);
    this.form.reset();
  }
}

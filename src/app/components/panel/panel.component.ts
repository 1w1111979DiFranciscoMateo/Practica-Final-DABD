import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Mode } from '../../models/mode';
import { ModeService } from '../../services/mode.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { Status } from '../../models/status';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit, OnDestroy{
  ngOnInit(): void {
    //llamar al metodo que carga el array de modes
    this.loadModes();
    //llamamos al metodo para cargar el array de status
    this.loadStatus();
    //llamamos al metodo que escucha cambios en el select para determinar el boton de armar/desarmar
    this.changeStatusFlag();
  }
  ngOnDestroy(): void {
    //Destruimos la subscription cuando no estamos en la pantalla
    this.subscription.unsubscribe();
  }

  //Injects
  private readonly modeService = inject(ModeService);
  private readonly loginService = inject(LoginService);

  //Creamos la subscripcion
  subscription = new Subscription();

  //array de modos de alarma para cargar el select
  alarmModeArray : Mode[] = [];
  //Array de status para setear si la alarma esta armada o no
  alarmStatusArray : Status[] = [];

  //bandera para chequear si la alarma/modo esta armada o desarmada
  armada : boolean = false;

  //form (el select)
  form = new UntypedFormGroup({
    alarmMode : new UntypedFormControl("", [Validators.required])
  });

  //metodo para cambiar el status de la bandera armada para setear su valor correctamente
  //dependiendo de el ultimo status del modo seleccionado en el select 
  changeStatusFlag(){
    this.form.controls["alarmMode"].valueChanges.subscribe((selectedModeId : string) => {
      if(!selectedModeId){
        return;
      }
      //buscamos el ultimo status del modo selecionado
      const lastStatus = this.alarmStatusArray.filter(status => status.modeId === selectedModeId)
      .sort((a, b) => new Date(b.lastUpdateDate).getTime() - new Date(a.lastUpdateDate).getTime())[0];
      //Actualizamos la bandera "armada"(operador ternario)
      this.armada = lastStatus ? lastStatus.activated : false;
    })
  }

  loadModes(){
    //obtener el id del usuario logeado
    const userId = this.loginService.user?.id;
    //metodo para verificar que userId no sea undefined.
    if(!userId){
      alert("El usuario no esta logeado")
      return;
    }

    const loadModesSubscription = this.modeService.getModesByUserId(userId).subscribe({
      next: (modes : Mode[]) => {
        this.alarmModeArray = modes;
      },
      error: (err) => {
        alert("Error al cargar array de Modos en el panel");
      }
    });
    this.subscription.add(loadModesSubscription);
  }

  //metodo para cargar un array de Status con todos los status en la API
  loadStatus(){
    const loadStatusSubscription = this.modeService.getAllStatus().subscribe({
      next: (allStatus : Status[]) => {
        this.alarmStatusArray = allStatus;
      },
      error: (err) => {
        alert("Error al cargar array de Status en el panel")
      }
    });
    this.subscription.add(loadStatusSubscription);
  }

  onSubmit(){
    if(this.form.invalid){
      alert("Formulario Invalido!");
      console.log(this.form.value);
      return;
    }
    //creamos un objeto tipo Status para guardar un historial de cambios de los modos de alarmas
    let request : Status = {
      activated : !this.armada,
      userId : this.loginService.user?.id || '',
      lastUpdateDate : new Date(),
      modeId : this.form.controls["alarmMode"].value,
      id : ""
    };
    const onSubmitSubscription = this.modeService.changeStatus(request).subscribe({
      next: () => {
        alert("Estado Cambiado Exitosamente!");
        //recargamos el array de status para asegurar que se actualize
        this.loadStatus();
        //le invierto el valor a la bandera armada, porque pasaria a ser lo opuesto una vez que se guarden los
        //cambios en la api
        this.armada = request.activated;
      },
      error: (err) => {
        alert("Error al cambiarle el status al modo seleccionado");
      }
    });
    this.subscription.add(onSubmitSubscription);
    //resetamos el valor del formulario sin disparar valueChanges
    this.form.controls["alarmMode"].setValue(this.form.controls["alarmMode"].value);
  }
}

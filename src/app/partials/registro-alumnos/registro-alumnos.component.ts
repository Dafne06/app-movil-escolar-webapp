import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumno:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public idUser: Number = 0;

  constructor(
    private router: Router,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private alumnosService: AlumnosService
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idUser = this.activatedRoute.snapshot.params['id'];
      this.alumno = this.datos_user;
      console.log("Editando alumno ID:", this.idUser);
    } else {
      // Si no hay ID, es un registro nuevo
      this.alumno = this.alumnosService.esquemaAlumno();
      this.alumno.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    // Lógica para registrar un nuevo alumno
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

    // Si hay errores, no continúa
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // Validar contraseñas
    if (this.alumno.password != this.alumno.confirmar_password) {
      alert('Las contraseñas no coinciden');
      return false;
    }

    // Consumir el servicio de registro
    this.alumnosService.registrarAlumno(this.alumno).subscribe({
      next: (response: any) => {
        alert('Alumno registrado con éxito');
        console.log("Alumno registrado:", response);

        // Redirigir según el rol
        if (this.token != "") {
          this.router.navigate(['alumnos']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error: any) => {
        if (error.status === 422) {
          this.errors = error.error.errors;
        } else {
          alert('Error al registrar el alumno');
        }
      }
    });
  }

  public actualizar(){
    // Lógica para actualizar los datos de un alumno existente
  }

  //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.alumno.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.alumno.fecha_nacimiento);
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

}

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) {}

  // --- Esquema base del alumno ---
  public esquemaAlumno() {
    return {
      'rol': '',
      'matricula': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': '',
      'telefono': '',
      'edad': '',
      'fecha_nacimiento': '',
      'rfc': '',
      'curp': '',
      'ocupacion': ''
    };
  }

  // --- Validaciones del formulario ---
  public validarAlumno(data: any, editar: boolean) {
    console.log("Validando alumno... ", data);
    let error: any = {};

    // Matricula
    if (!this.validatorService.required(data["matricula"])) {
      error["matricula"] = this.errorService.required;
    }

    // Nombre y apellidos
    if (!this.validatorService.required(data["first_name"])) {
      error["first_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["last_name"])) {
      error["last_name"] = this.errorService.required;
    }

    // Email
    if (!this.validatorService.required(data["email"])) {
      error["email"] = this.errorService.required;
    } else if (!this.validatorService.max(data["email"], 40)) {
      error["email"] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    // Contraseñas (solo si no se edita)
    if (!editar) {
      if (!this.validatorService.required(data["password"])) {
        error["password"] = this.errorService.required;
      }

      if (!this.validatorService.required(data["confirmar_password"])) {
        error["confirmar_password"] = this.errorService.required;
      }
    }

    // Teléfono
    if (!this.validatorService.required(data["telefono"])) {
      error["telefono"] = this.errorService.required;
    }

    // Edad
    /*if (!this.validatorService.required(data["edad"])) {
      error["edad"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["edad"])) {
      alert("El formato de edad debe ser numérico");
    } else if (data["edad"] < 17) {
      error["edad"] = "El alumno debe ser mayor o igual a 17 años";
    }*/

    // Fecha de nacimiento
    if (!this.validatorService.required(data["fecha_nacimiento"])) {
      error["fecha_nacimiento"] = this.errorService.required;
    }

    // RFC
    if (!this.validatorService.required(data["rfc"])) {
      error["rfc"] = this.errorService.required;
    } else if (!this.validatorService.min(data["rfc"], 12)) {
      error["rfc"] = this.errorService.min(12);
      alert("El RFC debe tener al menos 12 caracteres");
    } else if (!this.validatorService.max(data["rfc"], 13)) {
      error["rfc"] = this.errorService.max(13);
      alert("El RFC no debe exceder 13 caracteres");
    }

    // CURP
    if (!this.validatorService.required(data["curp"])) {
      error["curp"] = this.errorService.required;
    } else if (!this.validatorService.min(data["curp"], 18)) {
      error["curp"] = this.errorService.min(18);
      alert("El CURP debe tener 18 caracteres");
    } else if (!this.validatorService.max(data["curp"], 18)) {
      error["curp"] = this.errorService.max(18);
      alert("El CURP debe tener exactamente 18 caracteres");
    }

    // Ocupación
    if (!this.validatorService.required(data["ocupacion"])) {
      error["ocupacion"] = this.errorService.required;
    }

    return error;
  }

  // --- Servicios HTTP ---
  public registrarAlumno(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/alumnos/`, data, httpOptions);
  }


}

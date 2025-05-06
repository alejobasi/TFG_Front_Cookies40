import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ComprobacionAdminService {
  private esAdminSubject = new BehaviorSubject<boolean>(false);
  esAdmin$ = this.esAdminSubject.asObservable();

  constructor(private usuarioService: UsuarioService) {
    this.comprobacionAdmin();
  }

  comprobacionAdmin() {
    const sesion = localStorage.getItem('sesion');

    if (sesion) {
      try {
        const token = JSON.parse(sesion).token;
        const decodedToken: any = jwtDecode(token);
        const email = decodedToken?.sub;

        this.usuarioService.comprobarRolAdmin(email).subscribe(
          (rol) => {
            this.esAdminSubject.next(rol === 2); // Suponiendo que el rol de admin tiene ID 2
          },
          (error) => {
            console.error('Error al comprobar el rol del usuario:', error);
            this.esAdminSubject.next(false);
          }
        );
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.esAdminSubject.next(false);
      }
    } else {
      this.esAdminSubject.next(false);
    }
  }

  setEsAdmin(isAdmin: boolean): void {
    this.esAdminSubject.next(isAdmin); // Actualiza el estado global
  }

  cerrarSesion() {
    localStorage.removeItem('sesion');
    this.esAdminSubject.next(false);
  }
}

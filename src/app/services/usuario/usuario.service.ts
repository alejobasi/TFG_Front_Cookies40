import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/Usuario';
import { environment } from '../../../environments/environment';
import { DescuentoFecha } from '../../models/DescuentoFecha';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private api = `https://tfgbackcookies40-production.up.railway.app`;

  private https = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: any, options?: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.api}/registro`, usuario, {
      headers,
      ...options,
    });
  }
  loginUsuario(usuario: any, options?: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.api}/login`, usuario, {
      headers,
      ...options,
    });
  }
  estaLogueado(): boolean {
    return !!localStorage.getItem('sesion');
  }

  comprobarRolAdmin(email: string): Observable<number> {
    const token = JSON.parse(localStorage.getItem('sesion') || '{}').token;
    console.log(token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<number>(`${this.api}/esAdmin`, email, { headers });
  }

  getUsuarios(): Observable<Usuario[]> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Usuario[]>(`${this.api}/getAllUsuarios`, { headers });
  }
  eliminarUsuario(id: number): Observable<any> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;
    console.log('Token: ' + token);
    console.log('ID: ' + id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.api}/eliminarUsuario/${id}`, { headers });
  }

  codigoVerificacionCabiarContrasena(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.api}/restablecer-contrasena`, email, {
      headers,
    });
  }

  cambiarContrasena(envio: {
    correo: string;
    codigo: string;
    nuevaContrasena: string;
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.api}/cambiar-contrasena`, envio, { headers });
  }

  actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Usuario>(`${this.api}/actualizarUsuario`, usuario, {
      headers,
    });
  }

  asignarDescuentoUsuario(
    idUsuario: number,
    descuentoId: number
  ): Observable<Usuario> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    console.log('Enviando descuento ID:', descuentoId);

    return this.http.post<Usuario>(
      `${this.api}/usuario/descuento/${descuentoId}/${idUsuario}`,
      null,
      { headers }
    );
  }

  getDescuentosUsuario(idUsuario: number): Observable<DescuentoFecha> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<DescuentoFecha>(
      `${this.api}/usuario/descuento/${idUsuario}`,
      { headers }
    );
  }
}

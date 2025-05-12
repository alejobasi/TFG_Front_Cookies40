import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Carrito } from '../../models/Carrito';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private api = `https://tfgbackcookies40-production.up.railway.app/carrito`;

  constructor(private http: HttpClient) {}

  getCarrito(): Observable<Carrito> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const userId = sesion ? JSON.parse(sesion).usuario.id : null;
    return this.http.get<Carrito>(`${this.api}/obtener/${userId}`, { headers });
  }

  anadirProducto(
    idUsuario: number,
    idProducto: number,
    cantidad: number
  ): Observable<any> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      idUsuario,
      idProducto,
      cantidad,
    };

    return this.http.post(`${this.api}/agregar`, body, { headers });
  }
}

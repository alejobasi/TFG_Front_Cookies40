import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../../models/Pedido';
import { Observable } from 'rxjs';
import { DatosEntrega } from '../../models/DatosEntrega';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private api = `${environment.apiUrl}/pedido`;

  private https = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  constructor(private http: HttpClient) {}

  realizarPedido(pedido: Pedido): Observable<any> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const options = { headers };
    return this.http.post(`${this.api}/crear`, pedido, options);
  }

  getMisPedidos(): Observable<Pedido[]> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;
    const idUsuario = sesion ? JSON.parse(sesion).usuario.id : null;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const options = { headers };
    return this.http.get<Pedido[]>(`${this.api}/${idUsuario}`, options);
  }

  getDatosEntrega(): Observable<DatosEntrega[]> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;
    const idUsuario = sesion ? JSON.parse(sesion).usuario.id : null;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const options = { headers };
    return this.http.get<DatosEntrega[]>(
      `${this.api}/datosEntrega/${idUsuario}`,
      options
    );
  }

  guardarDireccion(direccion: DatosEntrega): Observable<any> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;
    const idUsuario = sesion ? JSON.parse(sesion).usuario.id : null;
    direccion.idUsuario = idUsuario;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const options = { headers };
    return this.http.post(
      `${this.api}/guardarDatosEntrega`,
      direccion,
      options
    );
  }
}

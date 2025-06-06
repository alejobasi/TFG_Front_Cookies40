import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingrediente } from '../../models/Ingrediente';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IngredienteService {
  private api = `https://tfgbackcookies40-production.up.railway.app/ingredientes`;

  constructor(private http: HttpClient) {}

  getIngredientes(): Observable<Ingrediente[]> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<Ingrediente[]>(this.api, { headers });
  }

  getIngredientesPorProductos(id: number): Observable<Ingrediente[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<Ingrediente[]>(`${this.api}/productos/${id}`, {
      headers,
    });
  }

  actualizarIngredientes(selectedFile: File) {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);

    return this.http.post(`${this.api}/actualizar`, formData, { headers });
  }
}

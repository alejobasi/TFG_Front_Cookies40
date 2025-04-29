import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingrediente } from '../../models/Ingrediente';

@Injectable({
  providedIn: 'root',
})
export class IngredienteService {
  private api = 'http://localhost:8080/ingredientes';

  constructor(private http: HttpClient) {}

  getIngredientes(): Observable<Ingrediente[]> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<Ingrediente[]>(this.api, { headers });
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

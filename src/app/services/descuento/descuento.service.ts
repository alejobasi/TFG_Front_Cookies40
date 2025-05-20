import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Descuento } from '../../models/Descuento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DescuentoService {
  private api = `https://tfgbackcookies40-production.up.railway.app/descuento`;

  constructor(private http: HttpClient) {}

  getDescuentos(): Observable<Descuento[]> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get<Descuento[]>(this.api, { headers });
  }
}

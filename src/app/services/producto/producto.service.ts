import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../models/Producto';
import { Familia } from '../../models/Familia';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private api = `${environment.apiUrl}/productos`;

  private https = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.api, this.https);
  }

  getProductosPaginados(page: number, size: number): Observable<any> {
    return this.http.get<any>(
      `${this.api}/paginados?page=${page}&size=${size}`,
      this.https
    );
  }

  buscarProductosPorIngredientes(
    ids: number[],
    page: number,
    tamano: number
  ): Observable<any> {
    const params = ids.map((id) => `idsIngredientes=${id}`).join('&');
    return this.http.get<any>(
      `${this.api}/porIngrediente?page=${page}&tamano=${tamano}&${params}`,
      this.https
    );
  }

  buscarProductosOfertados(page: number, tamano: number): Observable<any> {
    return this.http.get<any>(`${this.api}/oferta`, this.https);
  }

  buscarProductosNuevos(page: number, tamano: number): Observable<any> {
    return this.http.get<any>(`${this.api}/nuevos`, this.https);
  }

  buscarProductosConFiltros(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.api}/buscar/${nombre}`, this.https);
  }
  getFamilias(): Observable<Familia[]> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const options = { headers };
    return this.http.get<Familia[]>(this.api + '/familias', options);
  }
  crearProducto(producto: any): Observable<any> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const options = { headers };
    return this.http.post<any>(this.api + '/crear', producto, options);
  }

  subirImagenProducto(productoId: number, imagen: File): Observable<any> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;
    console.log(productoId, imagen);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('imagen', imagen, imagen.name);

    return this.http.post<any>(
      `${this.api}/imagenProducto/${productoId}`,
      formData,
      { headers }
    );
  }

  descatalogar(id: number): Observable<any> {
    const sesion = localStorage.getItem('sesion');
    const token = sesion ? JSON.parse(sesion).token : null;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const options = { headers };
    return this.http.put<any>(
      `${this.api}/descatalogar/${id}`,
      { id },
      options
    );
  }
}

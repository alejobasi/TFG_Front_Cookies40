import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../models/Producto';
import { Familia } from '../../models/Familia';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private api = 'http://localhost:8080/productos';

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

  buscarProductosConFiltros(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${this.api}/buscar/${nombre}`,
      this.https
    );
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
}

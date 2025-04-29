import { CarritoProducto } from './CarritoProducto';

export class Carrito {
  id: number;
  idUsuario: number; 
  productos: CarritoProducto[]; 

  constructor(id: number, idUsuario: number, productos: CarritoProducto[]) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.productos = productos;
  }
}
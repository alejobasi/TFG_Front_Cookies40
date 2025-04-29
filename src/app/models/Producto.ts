import { Familia } from "./Familia";
import { Ingrediente } from "./Ingrediente";

export class Producto {
  id: number;
  nombre: string;
  descripcion: string;
  descatalogado?: boolean ;
  ingredientes: Ingrediente[] | undefined;
  familia: Familia | undefined;
  precio: number;
  precioOferta?: number;
  fechaSalida?: Date;
  imagen: string;

  constructor (id: number, nombre: string, descripcion: string,  ingredientes: Ingrediente[], precio: number,
     precioOferta: number, fechaSalida: Date,  imagen: string, familia: Familia, descatalogado: boolean) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.ingredientes = ingredientes;
    this.precio = precio;
    this.precioOferta = precioOferta;
    this.fechaSalida = fechaSalida;
    this.imagen = imagen
    this.familia = familia;
    this.descatalogado = descatalogado;
  }

  getNombre () {
    return this.nombre;
  }

  getId () {
    return this.id;
  }

  getPrecio () {
    return this.precio;
  }

  getImagen () {
    return this.imagen;
  }

  getDescripcion () {
    return this.descripcion;
  }

  getIngredientes () {
    return this.ingredientes;
  }

  getPrecioOferta () {
    return this.precioOferta;
  }
  getFechaSalida () {
    return this.fechaSalida;
  }
  getFamilia () {
    return this.familia;
  }
  getDescatalogado () {
    return this.descatalogado;
  }

}

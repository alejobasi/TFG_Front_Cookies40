export class Descuento {
  id: number;
  nombre: string;
  cantidad: number;

  constructor(id: number, nombre: string, cantidad: number) {
    this.id = id;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }
}

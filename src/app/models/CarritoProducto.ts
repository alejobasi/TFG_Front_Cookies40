export class CarritoProducto {
    id: number;
    idProducto: number;
    cantidad: number; 
  
    constructor(id: number, idProducto: number, cantidad: number) {
      this.id = id;
      this.idProducto = idProducto;
      this.cantidad = cantidad;
    }
  }
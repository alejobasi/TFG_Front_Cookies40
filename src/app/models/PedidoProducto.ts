export class PedidoProducto {
    idProducto: number;
    cantidad: number;
  
    constructor(idProducto: number, cantidad: number) {
      this.idProducto = idProducto;
      this.cantidad = cantidad;
    }
  }
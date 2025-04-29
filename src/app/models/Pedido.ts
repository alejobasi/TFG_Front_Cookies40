import { PedidoProducto } from './PedidoProducto';

export class Pedido {
  idUsuario: number;
  total: number;
  productos: PedidoProducto[];
  idDatosEntrega: number;

  constructor(idUsuario: number, total: number, productos: PedidoProducto[], idDatosEntrega: number) {
    this.idUsuario = idUsuario;
    this.total = total;
    this.productos = productos;
    this.idDatosEntrega = idDatosEntrega;
  }
}
import { PedidoProducto } from './PedidoProducto';

export class Pedido {
  idUsuario: number;
  total: number;
  productos: PedidoProducto[];
  idDatosEntrega: number;
  descuento?: { id: number } | null; // En lugar de idDescuento

  constructor(
    idUsuario: number,
    total: number,
    productos: PedidoProducto[],
    idDatosEntrega: number,
    descuento?: { id: number } | null
  ) {
    this.idUsuario = idUsuario;
    this.total = total;
    this.productos = productos;
    this.idDatosEntrega = idDatosEntrega;
    this.descuento = descuento || null; // Inicializa como null si no se proporciona
  }
}

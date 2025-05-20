import { Descuento } from './Descuento';

export class DescuentoFecha {
  descuento: Descuento;
  fecha: string;

  constructor(descuento: Descuento, fecha: string) {
    this.descuento = descuento;
    this.fecha = fecha;
  }
}

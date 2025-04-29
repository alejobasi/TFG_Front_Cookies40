import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// Servicio para la comunicación entre componentes NavComponent y ModalDireccionEntregaComponent
// Para poder ejecutar el metodo realizarPedido() del servicio PedidoService desde el componente ModalDireccionEntregaComponent
export class PedidoComunicacionService {
  private realizarPedidoSource = new Subject<number>();
  realizarPedido$ = this.realizarPedidoSource.asObservable();

  triggerRealizarPedido(idDireccionEntrega: number): void {
    this.realizarPedidoSource.next(idDireccionEntrega);
  }
}

import { Component } from '@angular/core';
import { DatosEntrega } from '../../models/DatosEntrega';
import { PedidoService } from '../../services/pedido/pedido.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { PedidoComunicacionService } from '../../services/pedido-entrega-comunicacion/pedido-comunicacion-service.service';

@Component({
  selector: 'app-modal-direccion-entrega',
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-direccion-entrega.component.html',
  styleUrl: './modal-direccion-entrega.component.css'
})
export class ModalDireccionEntregaComponent {
  direccionesGuardadas: DatosEntrega[] = [];
  direccionSeleccionada!: DatosEntrega;
  nuevaDireccion: DatosEntrega = new DatosEntrega();

  constructor(private pedidoService: PedidoService, private  pedidoComunicacionService: PedidoComunicacionService) {}

  ngOnInit(): void {
    if (this.estaLogueado()) {
      this.cargarDireccionesGuardadas();
    }
   
  }
  estaLogueado() {
    const sesion = localStorage.getItem('sesion');
    return sesion !== null && sesion !== undefined;
  }

  cargarDireccionesGuardadas(): void {
    this.pedidoService.getDatosEntrega().subscribe({
      next: (direcciones) => {
        this.direccionesGuardadas = direcciones;
      },
      error: (err) => {
        console.error('Error al cargar direcciones guardadas:', err);
      }
    });
  }

  guardarNuevaDireccion(): void {
    console.log('Guardando nueva dirección:', this.nuevaDireccion);
    
    this.pedidoService.guardarDireccion(this.nuevaDireccion).subscribe({
      next: (response) => {
        console.log('Dirección guardada:', response);
        this.cargarDireccionesGuardadas(); 
        this.nuevaDireccion = new DatosEntrega(); 
      },
      error: (err) => {
        console.error('Error al guardar dirección:', err);
      }
    });
  }

  confirmarDireccion(): void {
    if (this.direccionSeleccionada) {
      console.log('Dirección seleccionada:', this.direccionSeleccionada);
      this.pedidoComunicacionService.triggerRealizarPedido(this.direccionSeleccionada.id!);
    } else {
      console.error('No se ha seleccionado ninguna dirección');
    }
    this.cerrarModal();
  }

  cerrarModal(): void {
    const modal = document.getElementById('modalDireccionEntrega');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }
  }
}

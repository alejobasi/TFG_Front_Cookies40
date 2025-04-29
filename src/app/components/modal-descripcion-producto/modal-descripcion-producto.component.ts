import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/Producto';

@Component({
  selector: 'app-modal-descripcion-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-descripcion-producto.component.html',
  styleUrls: ['./modal-descripcion-producto.component.css']
})
export class ModalDescripcionProductoComponent {
  @Input() producto: Producto | null = null;

  cerrarModal(): void {
    const modal = document.getElementById('descripcionProductoModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      
    }
  }

  abrirModal(): void {
    const modal = document.getElementById('descripcionProductoModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
      modal.focus();
    }
  }
  cerrarModalSiClicFuera(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.id === 'descripcionProductoModal') {
      this.cerrarModal();
    }
  }
}
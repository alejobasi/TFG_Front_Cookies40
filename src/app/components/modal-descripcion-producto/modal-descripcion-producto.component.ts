import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/Producto';
import { Ingrediente } from '../../models/Ingrediente';
import { IngredienteService } from '../../services/ingrediente/ingrediente.service';

@Component({
  selector: 'app-modal-descripcion-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-descripcion-producto.component.html',
  styleUrls: ['./modal-descripcion-producto.component.css'],
})
export class ModalDescripcionProductoComponent {
  @Input() producto: Producto | undefined;
  ingredientes: Ingrediente[] = [];

  constructor(private ingredienteService: IngredienteService) {}

  inicio(): void {
    console.log(this.producto);
    if (this.producto) {
      this.ingredienteService
        .getIngredientesPorProductos(this.producto.id)
        .subscribe((data: Ingrediente[]) => {
          this.ingredientes = data;
          console.log(data);
        });
    }
  }

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
    console.log(this.producto);
    const modal = document.getElementById('descripcionProductoModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
      modal.focus();
    }
    this.inicio();
  }
  cerrarModalSiClicFuera(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.id === 'descripcionProductoModal') {
      this.cerrarModal();
    }
  }
}

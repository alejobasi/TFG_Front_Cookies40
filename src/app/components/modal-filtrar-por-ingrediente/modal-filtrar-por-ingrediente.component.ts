import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ingrediente } from '../../models/Ingrediente';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-modal-filtrar-por-ingrediente',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './modal-filtrar-por-ingrediente.component.html',
  styleUrl: './modal-filtrar-por-ingrediente.component.css',
})
export class ModalFiltrarPorIngredienteComponent {
  @Input() ingredientes: Ingrediente[] = [];
  @Output() seleccionConfirmada = new EventEmitter<Ingrediente[]>();

  ingredientesSeleccionados: Ingrediente[] = [];
  page: number = 1; // Página actual para la paginación

  toggleIngrediente(ingrediente: Ingrediente): void {
    const index = this.ingredientesSeleccionados.indexOf(ingrediente);
    if (index === -1) {
      this.ingredientesSeleccionados.push(ingrediente);
    } else {
      this.ingredientesSeleccionados.splice(index, 1);
    }
  }

  confirmarSeleccion(): void {
    this.seleccionConfirmada.emit(this.ingredientesSeleccionados);
    this.cerrarModal();
  }

  cerrarModal(): void {
    const modal = document.getElementById('modalFiltrarPorIngrediente');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  abrirModal(): void {
    const modal = document.getElementById('modalFiltrarPorIngrediente');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
      modal.focus();
    }
  }

  resetearSeleccion() {
    this.ingredientesSeleccionados = [];
    this.page = 1;
  }
}

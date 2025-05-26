import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Ingrediente } from '../../models/Ingrediente';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-modal-filtrar-por-ingrediente',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './modal-filtrar-por-ingrediente.component.html',
  styleUrl: './modal-filtrar-por-ingrediente.component.css',
})
export class ModalFiltrarPorIngredienteComponent implements OnInit {
  // IDs de los ingredientes a excluir
  private ingredientesExcluidosIds: number[] = [2, 3, 4, 5];

  private _ingredientes: Ingrediente[] = [];
  ingredientesFiltrados: Ingrediente[] = [];

  @Input()
  set ingredientes(value: Ingrediente[]) {
    this._ingredientes = value || [];
    this.filtrarIngredientes();
  }

  get ingredientes(): Ingrediente[] {
    return this._ingredientes;
  }

  @Output() seleccionConfirmada = new EventEmitter<Ingrediente[]>();

  ingredientesSeleccionados: Ingrediente[] = [];
  page: number = 1;

  ngOnInit(): void {
    this.filtrarIngredientes();
  }

  private filtrarIngredientes(): void {
    console.log('Filtrando ingredientes...', this._ingredientes);

    if (!this._ingredientes || this._ingredientes.length === 0) {
      this.ingredientesFiltrados = [];
      return;
    }

    this.ingredientesFiltrados = this._ingredientes.filter((ingrediente) => {
      // Aseguramos que el ID sea tratado como número
      const id = Number(ingrediente.id);
      const excluir = this.ingredientesExcluidosIds.includes(id);
      return !excluir;
    });

    console.log('Ingredientes filtrados:', this.ingredientesFiltrados);
  }

  toggleIngrediente(ingrediente: Ingrediente): void {
    const index = this.ingredientesSeleccionados.findIndex(
      (i) => i.id === ingrediente.id
    );
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

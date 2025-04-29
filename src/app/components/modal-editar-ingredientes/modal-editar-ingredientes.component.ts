import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ingrediente } from '../../models/Ingrediente';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/Producto';

@Component({
  selector: 'app-modal-editar-ingredientes',
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-editar-ingredientes.component.html',
  styleUrl: './modal-editar-ingredientes.component.css'
})
export class ModalEditarIngredientesComponent {

  @Input() producto!: Producto; // Recibe el producto completo
  @Output() actualizarIngredientes = new EventEmitter<Producto>();; // Emite el producto actualizado
  
  cerrarModal(): void {
    const modal = document.getElementById('modalEditarIngredientes');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }
  }

  guardarCambios(): void {
    console.log('Producto actualizado:', this.producto);
    this.actualizarIngredientes.emit(this.producto); 
    this.cerrarModal();
  }
}

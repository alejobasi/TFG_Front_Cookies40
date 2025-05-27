import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto/producto.service';
import { Producto } from '../../models/Producto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Familia } from '../../models/Familia';
import { ModalCrearProductoComponent } from '../modal-crear-producto/modal-crear-producto.component';
import { Ingrediente } from '../../models/Ingrediente';
import { IngredienteService } from '../../services/ingrediente/ingrediente.service';

@Component({
  selector: 'app-productos-admin',
  imports: [
    FormsModule,
    CommonModule,
    NgxPaginationModule,
    ModalCrearProductoComponent,
  ],
  templateUrl: './productos-admin.component.html',
  styleUrl: './productos-admin.component.css',
})
export class ProductosAdminComponent implements OnInit {
  productoEditando: Producto | null = null;

  constructor(
    private productosService: ProductoService,
    private ingredienteService: IngredienteService
  ) {}
  ngOnInit(): void {
    const sesion = localStorage.getItem('sesion');
    if (sesion === null) {
      window.location.href = '/home';
    }
    const sesionObj = sesion ? JSON.parse(sesion) : null;
    const rol = sesionObj?.usuario?.rol;
    if (rol.id !== 2) {
      window.location.href = '/home';
    }

    this.obtenerProductos();
    this.obtenerFamilias();
    this.obtenerIngredientes();
  }

  productos: Producto[] = [];
  familias: Familia[] = [];
  ingredientes: Ingrediente[] = [];
  page: number = 1;

  obtenerProductos() {
    this.productosService.getProductos().subscribe((data: any) => {
      this.productos = data;
    });
  }
  obtenerFamilias() {
    this.productosService.getFamilias().subscribe((data: any) => {
      this.familias = data;
    });
  }
  obtenerIngredientes() {
    this.ingredienteService.getIngredientes().subscribe((data: any) => {
      this.ingredientes = data;
    });
  }
  irAFormulario() {
    this.obtenerIngredientes();
    const modal = document.getElementById('modalCrearProducto');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true');
      modal.classList.add('modal-open');
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }
  }

  descatalogar(productoId: number) {
    this.productosService.descatalogar(productoId).subscribe((response) => {
      this.obtenerProductos();
    });
  }

  editarProducto(producto: Producto) {
    this.productoEditando = Object.setPrototypeOf(
      { ...producto },
      Object.getPrototypeOf(producto)
    );

    const modal = document.getElementById('modalEditarProducto');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true');
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }
  }

  cerrarModalEditar() {
    const modal = document.getElementById('modalEditarProducto');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    this.productoEditando = null;
  }

  guardarCambios() {
    if (!this.productoEditando) return;

    // Si el precio de oferta está vacío o es 0, lo establecemos a null
    if (
      !this.productoEditando.precioOferta ||
      this.productoEditando.precioOferta <= 0
    ) {
      this.productoEditando.precioOferta = undefined;
    }

    // Validaciones básicas
    if (
      !this.productoEditando.nombre ||
      !this.productoEditando.descripcion ||
      !this.productoEditando.precio
    ) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Validar que el precio sea mayor que 0
    if (this.productoEditando.precio <= 0) {
      alert('El precio debe ser mayor que 0.');
      return;
    }

    // Validar que el precio de oferta sea menor que el precio normal
    if (
      this.productoEditando.precioOferta &&
      this.productoEditando.precioOferta >= this.productoEditando.precio
    ) {
      alert('El precio de oferta debe ser menor que el precio normal.');
      return;
    }

    // Enviamos la actualización al servicio
    this.productosService.actualizarProducto(this.productoEditando).subscribe({
      next: (response) => {
        console.log('Producto actualizado correctamente', response);
        this.cerrarModalEditar();
        this.obtenerProductos(); // Actualizamos la lista de productos
      },
      error: (error) => {
        console.error('Error al actualizar el producto', error);
        alert(
          'Error al actualizar el producto. Por favor, inténtalo de nuevo.'
        );
      },
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Familia } from '../../models/Familia';
import { Producto } from '../../models/Producto';
import { Ingrediente } from '../../models/Ingrediente';
import Swal from 'sweetalert2';
import { ModalEditarIngredientesComponent } from '../modal-editar-ingredientes/modal-editar-ingredientes.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductoService } from '../../services/producto/producto.service';
import { ModalSubirImagenComponent } from '../modal-subir-imagen/modal-subir-imagen.component';

@Component({
  selector: 'app-modal-crear-producto',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalEditarIngredientesComponent,
    NgxPaginationModule,
    ModalSubirImagenComponent,
  ],
  templateUrl: './modal-crear-producto.component.html',
  styleUrl: './modal-crear-producto.component.css',
})
export class ModalCrearProductoComponent implements OnInit {
  [x: string]: any;
  @Input() familias: Familia[] = [];
  @Input() ingredientes: Ingrediente[] = [];
  familiaSeleccionada!: Familia;
  ingredientesSeleccionados: Ingrediente[] = [];
  productoForm!: FormGroup;
  producto!: Producto;
  productoId!: number;
  page: number = 1;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      familia: [null, Validators.required],
      ingredientes: [[], Validators.required],
    });
  }

  resetFormulario(): void {
    this.productoForm.reset();
    this.familiaSeleccionada = undefined!;
    this.ingredientesSeleccionados = [];
    this.producto = undefined!;
  }
  guardarProducto(): void {
    const productoCrearDto = {
      nombre: this.productoForm.value.nombre,
      descripcion: this.productoForm.value.descripcion,
      precio: this.productoForm.value.precio,
      familiaId: this.familiaSeleccionada.id,
      ingredientes: this.ingredientesSeleccionados.map((ingrediente) => ({
        ingredienteId: ingrediente.id,
        cantidad: ingrediente.cantidad,
      })),
    };

    console.log('Producto a guardar:', productoCrearDto);

    this.productoService.crearProducto(productoCrearDto).subscribe(
      (response) => {
        this.productoId = response;
        Swal.fire({
          title: 'Producto Guardado',
          text: '¿Deseas insertar una imagen para el producto?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            this.abrirModalSubirImagen(response);
            this.cerrarModal();
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Producto Guardado',
              text: 'El producto se ha guardado correctamente.',
            });
            this.cerrarModal();
          }
        });
      },
      (error) => {
        console.error('Error al guardar el producto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar el producto.',
        });
      }
    );
  }

  abrirModalEditarIngredientes(): void {
    const modal = document.getElementById('modalEditarIngredientes');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
      modal.focus();
    }
  }

  actualizarIngredientesDesdeModal(productoActualizado: Producto): void {
    this.producto = productoActualizado;
    this.ingredientesSeleccionados = productoActualizado.ingredientes || [];
    console.log('Ingredientes actualizados:', this.ingredientesSeleccionados);
  }

  cerrarModal(): void {
    this.resetFormulario();
    const modal = document.getElementById('modalCrearProducto');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('aria-modal', 'false');
      modal.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';
    }
  }

  toggleIngrediente(ingrediente: Ingrediente): void {
    const index = this.ingredientesSeleccionados.indexOf(ingrediente);
    if (index === -1) {
      ingrediente.cantidad = 0.2;
      this.ingredientesSeleccionados.push(ingrediente);
    } else {
      this.ingredientesSeleccionados.splice(index, 1);
    }
    this.productoForm.controls['ingredientes'].setValue(
      this.ingredientesSeleccionados
    );
  }

  abrirModalSubirImagen(productoId: number): void {
    const modal = document.getElementById('modalSubirImagen');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
      modal.focus();
      console.log('ID del producto:', productoId);
    }
  }

  imagenSubidaDesdeModal(imagenUrl: string): void {
    this.producto.imagen = imagenUrl;
    console.log('Imagen asignada al producto:', this.producto.imagen);
    Swal.fire({
      icon: 'success',
      title: 'Imagen Subida',
      text: 'La imagen se ha subido correctamente.',
    });
    this.cerrarModal();
  }
}

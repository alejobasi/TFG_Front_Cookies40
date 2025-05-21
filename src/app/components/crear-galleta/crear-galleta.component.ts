import { Component, OnInit } from '@angular/core';
import { IngredienteService } from '../../services/ingrediente/ingrediente.service';
import { Ingrediente } from '../../models/Ingrediente';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/Producto';
import { ProductoService } from '../../services/producto/producto.service';
import { Familia } from '../../models/Familia';
import { CarritoService } from '../../services/carrito/carrito.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-crear-galleta',
  imports: [CommonModule],
  templateUrl: './crear-galleta.component.html',
  styleUrl: './crear-galleta.component.css',
})
export class CrearGalletaComponent implements OnInit {
  cancelarCreacion() {
    throw new Error('Method not implemented.');
  }
  ingredientes: Ingrediente[] = [];
  todosIngredientes: Ingrediente[] = [];

  ingredientesSobreGalleta: any[] = [];
  precioTotal: number = 0;

  constructor(
    private ingredienteServices: IngredienteService,
    private productosServices: ProductoService,
    private carritoServices: CarritoService
  ) {}

  ngOnInit(): void {
    this.ingredienteServices.getIngredientes().subscribe({
      next: (data) => {
        this.todosIngredientes = data;
        this.ingredientes = data;
        this.precioTotal = 3.5;
        this.eliminarIngredientesPorId();
        console.log('Ingredientes obtenidos:', this.ingredientes);
      },
      error: (error) => {
        console.error('Error al obtener ingredientes:', error);
      },
    });
  }
  agregarIngrediente(index: number): void {
    const ingrediente = this.ingredientes[index];

    const galletaBase = document.querySelector('.galleta-base') as HTMLElement;
    const galletaWidth = galletaBase.offsetWidth;
    const galletaHeight = galletaBase.offsetHeight;

    const posicionX = galletaWidth - 350;
    const posicionY = galletaHeight - 350;
    this.precioTotal += 0.5;

    this.ingredientesSobreGalleta.push({
      ...ingrediente,
      posicionX,
      posicionY,
    });

    // Eliminar el ingrediente de la lista
    this.ingredientes.splice(index, 1);

    console.log('Ingredientes sobre galleta:', this.ingredientesSobreGalleta);
  }

  eliminarIngredientesPorId(): void {
    this.ingredientes = this.ingredientes.filter(
      (ingrediente) => ![2, 3, 4, 5].includes(ingrediente.id)
    );
  }

  eliminarIngredienteSobreGalleta(index: number): void {
    // Recuperar el ingrediente antes de eliminarlo
    const ingredienteEliminado = this.ingredientesSobreGalleta[index];

    // Eliminar de la galleta
    this.ingredientesSobreGalleta.splice(index, 1);

    // Restar el precio
    this.precioTotal -= 0.5;

    // Devolver a la lista de ingredientes disponibles
    this.ingredientes.push(
      new Ingrediente(
        ingredienteEliminado.id,
        ingredienteEliminado.nombre,
        ingredienteEliminado.imagen,
        0
      )
    );

    this.ingredientes.sort((a, b) => a.id - b.id);

    console.log(
      'Ingrediente eliminado de la galleta:',
      ingredienteEliminado.nombre
    );
  }

  guardarGalleta() {
    // Array para almacenar solo los IDs de ingredientes
    const ingredientesIds: number[] = [];

    // Extraer los IDs de los ingredientes personalizados añadidos
    this.ingredientesSobreGalleta.forEach((ingrediente) => {
      ingredientesIds.push(ingrediente.id);
    });

    // Añadir los IDs de los ingredientes base
    ingredientesIds.push(
      this.todosIngredientes[1].id,
      this.todosIngredientes[2].id,
      this.todosIngredientes[3].id,
      this.todosIngredientes[4].id
    );

    console.log('IDs de ingredientes a enviar:', ingredientesIds);

    // Llamar al servicio con solo los IDs y el precio
    this.productosServices
      .comprobarProducto(ingredientesIds, this.precioTotal)
      .subscribe({
        next: (response) => {
          console.log('Id galleta', response);
          const sesion = localStorage.getItem('sesion');
          const idUsuario = sesion ? JSON.parse(sesion).usuario.id : null;
          this.carritoServices
            .anadirProducto(idUsuario, response, 1)
            .subscribe({
              next: (response) => {
                console.log('Producto añadido al carrito:', response);
                Swal.fire({
                  title: 'Galleta añadida',
                  text: 'La galleta ha sido añadida al carrito.',
                  timer: 2000,
                  showConfirmButton: false,
                  color: '#ff4aaa',
                });
                setTimeout(() => {
                  window.location.href = '/tienda';
                }, 2000);
              },
              error: (error) => {
                console.error('Error al añadir producto al carrito:', error);
              },
            });
        },
        error: (error) => {
          console.error('Error al guardar la galleta:', error);
        },
      });
  }
}

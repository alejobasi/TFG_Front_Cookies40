import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/Producto';
import { ListaProductos } from '../../models/ListaProductos';
import { ProductoService } from '../../services/producto/producto.service';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { ModalLoginService } from '../../services/modal-login/modal-login.service';
import { CarritoService } from '../../services/carrito/carrito.service';
import { ModalDescripcionProductoComponent } from '../modal-descripcion-producto/modal-descripcion-producto.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IngredienteService } from '../../services/ingrediente/ingrediente.service';
import { Ingrediente } from '../../models/Ingrediente';
import { ModalFiltrarPorIngredienteComponent } from '../modal-filtrar-por-ingrediente/modal-filtrar-por-ingrediente.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [
    CommonModule,
    ModalDescripcionProductoComponent,
    RouterLink,
    FormsModule,
    ModalFiltrarPorIngredienteComponent,
  ],
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css'],
})
export class TiendaComponent implements OnInit {
  productos: Producto[] = [];
  carrito: ListaProductos[] = [];
  productosFiltrados: Producto[] = [];
  busqueda: string = '';
  filtroSeleccionado: string = '';

  ingredientes: Ingrediente[] = [];
  ingredienteSeleccionado: string | null = 'Todos';

  paginaActual: number = 0;
  tamanioPagina: number = 6;
  totalPaginas: number = 0;

  totalProductos: number = 0;

  @ViewChild(ModalLoginComponent) loginModal!: ModalLoginComponent;
  @ViewChild(ModalFiltrarPorIngredienteComponent)
  modalFiltrarIngredientes!: ModalFiltrarPorIngredienteComponent;

  constructor(
    private productoService: ProductoService,
    private modalLoginService: ModalLoginService,
    private carritoServices: CarritoService,
    private ingredientesService: IngredienteService
  ) {}

  @ViewChild('descripcionModal')
  descripcionModal!: ModalDescripcionProductoComponent;

  ngOnInit(): void {
    this.cargarProductosPaginados();
    this.cargarProductos();
    this.cargarCarrito();
    this.cargarIngredientes();
  }

  private cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => (this.productos = data),
      error: (error) => console.error('Error cargando productos', error),
    });
  }

  private cargarIngredientes(): void {
    this.ingredientesService.getIngredientes().subscribe({
      next: (data) => {
        this.ingredientes = data;
        console.log('Ingredientes cargados:', this.ingredientes);
      },
      error: (error) => console.error('Error cargando ingredientes', error),
    });
  }

  filtrarProductosPorIngredientes(
    ingredientesSeleccionados: Ingrediente[]
  ): void {
    if (ingredientesSeleccionados.length === 0) {
      this.cargarProductosPaginados();
      return;
    }

    const idsIngredientes = ingredientesSeleccionados.map((ing) => ing.id);

    this.productoService
      .buscarProductosPorIngredientes(
        idsIngredientes,
        this.paginaActual,
        this.tamanioPagina
      )
      .subscribe({
        next: (response) => {
          this.productosFiltrados = response.content;
          console.log('Productos filtrados por ingredientes:', response);
        },
        error: (error) => {
          console.error('Error al filtrar productos por ingredientes:', error);
        },
      });
  }
  cargarProductosPaginados(): void {
    this.productoService
      .getProductosPaginados(this.paginaActual, this.tamanioPagina)
      .subscribe({
        next: (response) => {
          this.productosFiltrados = response.content;
          this.totalPaginas = response.totalPages;
          this.totalProductos = response.totalElements;
          console.log('Productos paginados:', response);
        },
        error: (error) => {
          console.error('Error al cargar productos paginados:', error);
        },
      });
  }

  cargarSiguientePagina(): void {
    if (this.paginaActual + 1 < this.totalPaginas) {
      this.paginaActual++;
      this.cargarProductosPaginados();
    }
  }
  cargarPaginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.cargarProductosPaginados();
    }
  }
  private cargarCarrito(): void {
    const carrito = localStorage.getItem('carrito');
    if (carrito) {
      this.carrito = JSON.parse(carrito);
    }
  }

  anadirCarrito(producto: Producto): void {
    const sesion = localStorage.getItem('sesion');
    if (sesion) {
      const idUsuario = JSON.parse(sesion).usuario.id;
      const idProducto = producto.id;
      const cantidad = 1;

      // Primero verificamos el stock
      this.carritoServices.verificarStock(idProducto).subscribe({
        next: (response) => {
          if (response) {
            // Solo añadimos al carrito si hay stock
            this.carritoServices
              .anadirProducto(idUsuario, idProducto, cantidad)
              .subscribe({
                next: (data) => {

                  const menuIcon = document.querySelector('.menu-icon');
                  const menuButton = document.querySelector('.menu-button');
                  if (menuIcon && menuButton) {
                    menuIcon.classList.remove('bi-list');
                    menuIcon.classList.add('bi-cart');
                    menuButton.classList.add('button-blink');

                    setTimeout(() => {
                      menuIcon.classList.remove('bi-cart');
                      menuIcon.classList.add('bi-list');
                      menuButton.classList.remove('button-blink');
                    }, 1000);
                  }

                  this.cargarCarrito();
                },
                error: (error) => {
                },
              });
          } else {
            // Mostramos mensaje de error solo si no hay stock
            Swal.fire({
              icon: 'error',
              title: 'Sin stock',
              text: 'No hay stock disponible para este producto.',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            });
          }
        },
        error: (error) => {
        },
      });
    } else {
      this.modalLoginService.openModal();
    }
  }

  abrirDescripcion(producto: Producto) {
    this.descripcionModal.producto = producto;
    this.descripcionModal.abrirModal();
  }

  abrirModalFiltrarIngredientes(): void {
    this.modalFiltrarIngredientes.abrirModal();
  }
  filtrarProductos(): void {
    if (!this.busqueda.trim()) {
      this.cargarProductosPaginados();
      return;
    }

    this.filtroSeleccionado = '';
    if (this.modalFiltrarIngredientes) {
      this.modalFiltrarIngredientes.resetearSeleccion();
    }

    this.productoService
      .buscarProductosConFiltros(this.busqueda.trim())
      .subscribe({
        next: (productos) => {
          this.productosFiltrados = productos.content;
          console.log('Productos encontrados:', productos);
        },
        error: (error) => {
          console.error('Error al buscar productos:', error);
        },
      });
  }

  cambiarFiltro(filtro: string): void {
    this.filtroSeleccionado = filtro;

    if (filtro === 'nuevo') {
      this.productoService
        .buscarProductosNuevos(this.paginaActual, this.tamanioPagina)
        .subscribe({
          next: (response) => {
            this.productosFiltrados = response.content;
            console.log('Productos nuevos:', response);
          },
          error: (error) => {
            console.error('Error al cargar productos nuevos:', error);
          },
        });
    } else if (filtro === 'oferta') {
      this.productoService
        .buscarProductosOfertados(this.paginaActual, this.tamanioPagina)
        .subscribe({
          next: (response) => {
            this.productosFiltrados = response.content;
            console.log('Productos en oferta:', response);
          },
          error: (error) => {
            console.error('Error al cargar productos en oferta:', error);
          },
        });
    } else {
      this.cargarProductosPaginados();
    }
  }

  esNuevo(producto: Producto): boolean {
    if (!producto.fechaSalida) {
      return false;
    }
    const fechaSalida = new Date(producto.fechaSalida);
    const hoy = new Date();
    const diferenciaEnDias =
      (hoy.getTime() - fechaSalida.getTime()) / (1000 * 60 * 60 * 24);
    return diferenciaEnDias <= 7;
  }
}

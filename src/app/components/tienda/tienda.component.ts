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

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [
    CommonModule,
    ModalDescripcionProductoComponent,
    RouterLink,
    FormsModule,
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

  paginaActual: number = 0;
  tamanioPagina: number = 6;
  totalPaginas: number = 0;

  @ViewChild(ModalLoginComponent) loginModal!: ModalLoginComponent;

  constructor(
    private productoService: ProductoService,
    private modalLoginService: ModalLoginService,
    private carritoServices: CarritoService
  ) {}

  @ViewChild('descripcionModal')
  descripcionModal!: ModalDescripcionProductoComponent;

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        console.log(data);
        this.productos = data;
        this.productosFiltrados = data;
        console.log('Productos obtenidos:', this.productos);
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      },
    });

    this.cargarProductos();
    this.cargarCarrito();
  }

  private cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => (this.productos = data),
      error: (error) => console.error('Error cargando productos', error),
    });
  }

  cargarProductosPaginados(): void {
    this.productoService
      .getProductosPaginados(this.paginaActual, this.tamanioPagina)
      .subscribe({
        next: (response) => {
          this.productosFiltrados = response.content;
          this.totalPaginas = response.totalPages;
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

      this.carritoServices
        .anadirProducto(idUsuario, idProducto, cantidad)
        .subscribe({
          next: (data) => {
            console.log('Producto añadido al carrito:', data);

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
            console.error('Error al añadir producto al carrito:', error);
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
  filtrarProductos(): void {
    if (!this.busqueda.trim()) {
      this.productosFiltrados = this.productos;
      return;
    }

    this.productoService
      .buscarProductosConFiltros(this.busqueda.trim())
      .subscribe({
        next: (productos) => {
          this.productosFiltrados = productos;
          console.log('Productos encontrados:', productos);
        },
        error: (error) => {
          console.error('Error al buscar productos:', error);
        },
      });
    this.filtroSeleccionado = '';
  }

  cambiarFiltro(filtro: string): void {
    this.filtroSeleccionado = filtro;

    if (filtro === 'nuevo') {
      this.productosFiltrados = this.productosFiltrados.filter((producto) =>
        this.esNuevo(producto)
      );
    } else if (filtro === 'oferta') {
      this.productosFiltrados = this.productosFiltrados.filter(
        (producto) => (producto.precioOferta ?? 0) > 0
      );
    } else {
      this.filtrarProductos();
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

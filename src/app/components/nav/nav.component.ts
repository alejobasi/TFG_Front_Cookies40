import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ListaProductos } from '../../models/ListaProductos';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ModalLoginService } from '../../services/modal-login/modal-login.service';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/Producto';
import { PedidoService } from '../../services/pedido/pedido.service';
import { Pedido } from '../../models/Pedido';
import Swal from 'sweetalert2';
import { PedidoComunicacionService } from '../../services/pedido-entrega-comunicacion/pedido-comunicacion-service.service';
import { ModalEditarUsuarioComponent } from '../usuarios/modal-editar-usuario/modal-editar-usuario.component';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule, ModalEditarUsuarioComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  usuario: any = null;
  carrito: any = null;
  usuarioSeleccionado!: Usuario;
  constructor(
    private usuarioService: UsuarioService,
    private modalLogin: ModalLoginService,
    private router: Router,
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private pedidoComunicacionService: PedidoComunicacionService
  ) {}

  ngOnInit() {
    this.pedidoComunicacionService.realizarPedido$.subscribe(
      (idDireccionEntrega) => {
        this.realizarPedido(idDireccionEntrega);
      }
    );
    this.cargarUsuario();
    if (this.estaLogueado()) {
      this.cargarCarrito();
    }
    const offcanvasElement = document.getElementById('offcanvasRight');
    if (offcanvasElement) {
      offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
        if (this.estaLogueado()) {
          this.cargarCarrito();
        }
      });
    }
  }

  cargarCarrito() {
    this.carritoService.getCarrito().subscribe({
      next: (data) => {
        this.carrito = data.productos.map((item: any) => ({
          producto: item.producto,
          cantidad: item.cantidad,
        }));
      },
    });
  }

  anadirProductoAlCarrito(producto: Producto) {
    const sesion = localStorage.getItem('sesion');
    if (!sesion) {
      console.error('Usuario no autenticado');
      return;
    }

    const idUsuario = JSON.parse(sesion).usuario.id;
    const idProducto = producto.id;
    const cantidad = 1;

    this.carritoService
      .anadirProducto(idUsuario, idProducto, cantidad)
      .subscribe({
        next: (data) => {
          this.carrito = data;
          console.log('Producto añadido al carrito:', data);
          this.cargarCarrito();
        },
        error: (error) => {
          console.error('Error al añadir producto al carrito:', error);
        },
      });
  }

  quitarProductoAlCarrito(producto: Producto) {
    const sesion = localStorage.getItem('sesion');
    if (!sesion) {
      console.error('Usuario no autenticado');
      return;
    }

    const idUsuario = JSON.parse(sesion).usuario.id;
    const idProducto = producto.id;
    const cantidad = -1;

    this.carritoService
      .anadirProducto(idUsuario, idProducto, cantidad)
      .subscribe({
        next: (data) => {
          this.carrito = data;
          console.log('Producto añadido al carrito:', data);
          this.cargarCarrito();
        },
        error: (error) => {
          console.error('Error al añadir producto al carrito:', error);
        },
      });
  }

  totalCarrito() {
    let total = 0;
    if (this.carrito) {
      this.carrito.forEach((item: any) => {
        if (item.producto.precioOferta) {
          total += item.producto.precioOferta * item.cantidad;
        } else {
          total += item.producto.precio * item.cantidad;
        }
      });
    }
    return total.toFixed(2);
  }

  cargarUsuario() {
    const usuarioGuardado = localStorage.getItem('sesion');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado).usuario;
      this.usuario.nombre = this.usuario.nombre.toUpperCase();
    }
  }

  abrirModalDireccionEntrega() {
    const offcanvasElement = document.getElementById('offcanvasRight');
    if (offcanvasElement) {
      const offcanvasInstance = (window as any).bootstrap.Offcanvas.getInstance(
        offcanvasElement
      );
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    }

    const modal = document.getElementById('modalDireccionEntrega');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
      modal.focus();
    }
  }

  realizarPedido(idDatosEntrega: number) {
    const sesion = localStorage.getItem('sesion');
    if (!sesion) {
      console.error('Usuario no autenticado');
      return;
    }
    const idUsuario = JSON.parse(sesion).usuario.id;
    const pedido: Pedido = {
      idUsuario: idUsuario,
      total: parseFloat(this.totalCarrito()),
      productos: this.carrito.map((item: any) => ({
        idProducto: item.producto.id,
        cantidad: item.cantidad,
      })),
      idDatosEntrega: idDatosEntrega,
    };
    console.log('Pedido:', pedido);
    this.pedidoService.realizarPedido(pedido).subscribe({
      next: (data) => {
        console.log('Pedido realizado:', data);
        this.carrito = null;
        Swal.fire({
          title: 'Pedido realizado con éxito',
          imageAlt: 'cookies40',
          imageUrl: 'assets/images/logo.png',
          imageHeight: 100,
          imageWidth: 385,
          padding: '0rem',
          color: '#ff4aaa',
          showConfirmButton: false,
          timer: 1500,
          text: 'Gracias por tu compra.',
        });
      },
      error: (error) => {
        console.error('Error al realizar el pedido:', error);
      },
    });
  }

  estaLogueado() {
    return this.usuarioService.estaLogueado();
  }

  abrirModal() {
    const offcanvasElement = document.getElementById('offcanvasRight');
    if (offcanvasElement) {
      const offcanvasInstance = (window as any).bootstrap.Offcanvas.getInstance(
        offcanvasElement
      );
      if (offcanvasInstance) {
        offcanvasInstance.hide(); // Cierra el menú lateral
      }
      this.modalLogin.openModal();
    }
  }
  cerrarModal() {
    this.modalLogin.closeModal();
  }

  abrirModalRegistro(): void {
    this.modalLogin.openRegistroModal();
  }

  cerrarModalRegistro(): void {
    this.modalLogin.closeRegistroModal();
  }
  cerrarSesion() {
    localStorage.removeItem('sesion');
    this.router.navigate(['/']);
    this.usuario = null;
    this.carrito = null;
  }
  abrirModalEdicion(): void {
    const offcanvasElement = document.getElementById('offcanvasRight');
    if (offcanvasElement) {
      const offcanvasInstance = (window as any).bootstrap.Offcanvas.getInstance(
        offcanvasElement
      );
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    }
    const sesion = localStorage.getItem('sesion');
    if (sesion) {
      this.usuarioSeleccionado = JSON.parse(sesion).usuario;
      const modal = document.getElementById('modalEditarUsuario');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        modal.setAttribute('aria-modal', 'true');
        modal.removeAttribute('aria-hidden');
        modal.focus();
      }
    } else {
      console.error('No hay sesión activa');
    }
  }
}

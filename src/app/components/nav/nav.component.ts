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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ModalEditarUsuarioComponent,
    FormsModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  usuario: any = null;
  carrito: any = null;
  usuarioSeleccionado!: Usuario;
  descuentoAplicado: boolean = false;
  totalConDescuento: string = '0.00';
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
    // Verificar que hay productos en el carrito
    if (!this.carrito || this.carrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'No tienes productos en el carrito',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      return;
    }

    // Array para almacenar productos sin stock
    const productosSinStock: string[] = [];

    // Contador para seguir el progreso de las verificaciones
    let verificacionesCompletadas = 0;

    // Para cada producto en el carrito, verificamos su stock
    this.carrito.forEach((item: any) => {
      this.carritoService.verificarStock(item.producto.id).subscribe({
        next: (hayStock) => {
          verificacionesCompletadas++;

          // Si no hay stock, añadimos el producto a la lista
          if (!hayStock) {
            productosSinStock.push(item.producto.nombre);
          }

          // Si hemos verificado todos los productos, procedemos
          if (verificacionesCompletadas === this.carrito.length) {
            if (productosSinStock.length > 0) {
              // Mostramos mensaje de error con los productos sin stock
              Swal.fire({
                icon: 'error',
                title: 'Productos sin stock',
                html: `<p>Los siguientes productos no tienen stock suficiente:</p>
                    <ul>${productosSinStock
                      .map((nombre) => `<li>${nombre}</li>`)
                      .join('')}</ul>`,
                confirmButtonText: 'Entendido',
              });
            } else {
              // Si todos tienen stock, cerramos el offcanvas y abrimos el modal
              const offcanvasElement =
                document.getElementById('offcanvasRight');
              if (offcanvasElement) {
                const offcanvasInstance = (
                  window as any
                ).bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (offcanvasInstance) {
                  offcanvasInstance.hide();
                }
              }

              // Preparamos la lista de productos para pasar al modal
              const productosParaPedido = this.carrito.map((item: any) => ({
                producto: item.producto,
                cantidad: item.cantidad,
              }));

              // En lugar de usar el servicio, guardamos en localStorage
              localStorage.setItem(
                'productosParaPedido',
                JSON.stringify(productosParaPedido)
              );

              // Abrimos el modal de dirección de entrega
              const modal = document.getElementById('modalDireccionEntrega');
              if (modal) {
                modal.classList.add('show');
                modal.style.display = 'block';
                modal.setAttribute('aria-modal', 'true');
                modal.removeAttribute('aria-hidden');
                modal.focus();
              }
            }
          }
        },
        error: (error) => {
          verificacionesCompletadas++;
          console.error(
            `Error al verificar stock del producto ${item.producto.nombre}:`,
            error
          );

          // Si es el último, verificamos si podemos proceder
          if (
            verificacionesCompletadas === this.carrito.length &&
            productosSinStock.length === 0
          ) {
            Swal.fire({
              icon: 'error',
              title: 'Error al verificar stock',
              text: 'Hubo un problema al verificar el stock de algunos productos',
              confirmButtonText: 'Intentar de nuevo',
            });
          }
        },
      });
    });
  }

  tieneDescuentoDisponible(): boolean {
    if (!this.usuario || !this.usuario.descuento) {
      return false;
    }
    return true;
  }

  obtenerPorcentajeDescuento(): number {
    if (this.tieneDescuentoDisponible()) {
      return this.usuario.descuento.cantidad || 0;
    }
    return 0;
  }

  calcularValorDescuento(): string {
    if (!this.descuentoAplicado) return '0.00';

    const total = parseFloat(this.totalCarrito());
    const porcentaje = this.obtenerPorcentajeDescuento();
    const valorDescuento = (total * porcentaje) / 100;

    return valorDescuento.toFixed(2);
  }

  calcularTotalConDescuento(): void {
    const total = parseFloat(this.totalCarrito());

    if (this.descuentoAplicado && this.tieneDescuentoDisponible()) {
      const descuento = parseFloat(this.calcularValorDescuento());
      this.totalConDescuento = (total - descuento).toFixed(2);
    } else {
      this.totalConDescuento = total.toFixed(2);
    }
  }

  realizarPedido(idDatosEntrega: number) {
    const sesion = localStorage.getItem('sesion');
    if (!sesion) {
      console.error('Usuario no autenticado');
      return;
    }
    const idUsuario = JSON.parse(sesion).usuario.id;

    // Total final dependiendo de si aplica descuento o no
    const totalFinal =
      this.descuentoAplicado && this.tieneDescuentoDisponible()
        ? parseFloat(this.totalConDescuento)
        : parseFloat(this.totalCarrito());

    const pedido: Pedido = {
      idUsuario: idUsuario,
      total: totalFinal,
      productos: this.carrito.map((item: any) => ({
        idProducto: item.producto.id,
        cantidad: item.cantidad,
      })),
      idDatosEntrega: idDatosEntrega,
      // Cambiar esto
      descuento:
        this.descuentoAplicado && this.tieneDescuentoDisponible()
          ? { id: this.usuario.descuento.id }
          : null,
    };

    console.log('Pedido:', pedido);
    this.pedidoService.realizarPedido(pedido).subscribe({
      next: (data) => {
        console.log('Pedido realizado:', data);
        this.carrito = null;

        // Si aplicó descuento, actualizar el usuario para eliminar el descuento
        if (this.descuentoAplicado && this.tieneDescuentoDisponible()) {
          const sesionActual = JSON.parse(sesion);
          sesionActual.usuario.descuento = null;
          localStorage.setItem('sesion', JSON.stringify(sesionActual));
          this.usuario = sesionActual.usuario;
          this.descuentoAplicado = false;
        }

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

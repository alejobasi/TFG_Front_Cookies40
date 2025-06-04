import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido/pedido.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto/producto.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-pedidos',
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.css',
})
export class MisPedidosComponent implements OnInit {
  pedidos: any[] = [];
  productos: any[] = [];
  nombreUsuario: string = '';
  cargando: boolean = true;

  constructor(
    private pedidoService: PedidoService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    const sesion = localStorage.getItem('sesion');
    if (sesion) {
      const sesionObj = JSON.parse(sesion);
      const usuario = sesionObj.usuario;
      this.nombreUsuario = usuario.nombre;

      const direccionesEntrega = usuario.datosEntrega || [];

      this.productoService.getProductos().subscribe({
        next: (productos) => {
          this.productos = productos;

          // Después cargamos los pedidos
          this.pedidoService.getMisPedidos().subscribe({
            next: (pedidos) => {
              console.log('Pedidos obtenidos:', pedidos);
              this.pedidos = pedidos.map((pedido) => {
                const datosEntrega = direccionesEntrega.find(
                  (dir: any) => dir.id === pedido.idDatosEntrega
                );

                return {
                  ...pedido,
                  expanded: false,
                  datosEntrega: datosEntrega || null,
                  productos: pedido.productos.map((pedidoProducto: any) => {
                    const productoCompleto = this.productos.find(
                      (p) => p.id === pedidoProducto.idProducto
                    );

                    // Determinar qué precio usar (oferta o normal)
                    const precioAUsar =
                      productoCompleto && productoCompleto.precioOferta
                        ? productoCompleto.precioOferta
                        : productoCompleto
                        ? productoCompleto.precio
                        : 0;

                    return {
                      ...pedidoProducto,
                      nombre: productoCompleto
                        ? productoCompleto.nombre
                        : 'Producto no disponible',
                      precio: productoCompleto ? productoCompleto.precio : 0,
                      precioOferta: productoCompleto
                        ? productoCompleto.precioOferta
                        : null,
                      imagen: productoCompleto
                        ? productoCompleto.imagenUrl || productoCompleto.imagen
                        : '',
                      // Usar el precio correcto para el subtotal
                      subtotal: precioAUsar * pedidoProducto.cantidad,
                    };
                  }),
                };
              });

              console.log('Pedidos procesados:', this.pedidos);
              this.cargando = false;
            },
            error: (error) => {
              console.error('Error al obtener pedidos:', error);
              this.cargando = false;
            },
          });
        },
        error: (error) => {
          console.error('Error al obtener productos:', error);
          this.cargando = false;
        },
      });
    }
  }
  togglePedido(pedido: any): void {
    pedido.expanded = !pedido.expanded;
  }

  calcularDescuentoAplicado(pedido: any): number {
    if (!pedido.descuento) return 0;

    // Calculamos el subtotal (suma de todos los productos)
    const subtotal = pedido.productos.reduce(
      (total: number, producto: any) => total + producto.subtotal,
      0
    );

    // Calculamos el valor del descuento
    const valorDescuento = (subtotal * pedido.descuento.cantidad) / 100;

    return valorDescuento;
  }

  // Modificar el método de descarga para incluir el descuento
  descargarPedido(pedido: any): void {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(255, 74, 170);
    doc.text('COOKIES40', 105, 20, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Color negro
    doc.text(`Pedido #${pedido.id}`, 105, 30, { align: 'center' });

    doc.setFontSize(12);
    doc.text(
      `Fecha: ${new Date(pedido.fechaHora).toLocaleDateString(
        'es-ES'
      )} ${new Date(pedido.fechaHora).toLocaleTimeString('es-ES')}`,
      20,
      45
    );

    // Dirección de entrega
    if (pedido.datosEntrega) {
      doc.setFontSize(14);
      doc.text('Dirección de entrega:', 20, 60);
      doc.setFontSize(12);
      let direccion = `${pedido.datosEntrega.calle}, ${pedido.datosEntrega.numero}`;
      if (pedido.datosEntrega.piso) {
        direccion += `, ${pedido.datosEntrega.piso}`;
      }
      doc.text(direccion, 20, 67);
      doc.text(`Teléfono: ${pedido.datosEntrega.telefono}`, 20, 74);
    }

    doc.setFontSize(14);
    doc.text('Productos:', 20, 90);

    const tableColumn = ['Producto', 'Cantidad', 'Precio', 'Subtotal'];
    const tableRows: any[] = [];

    pedido.productos.forEach((producto: any) => {
      const precioMostrar = producto.precioOferta || producto.precio;
      const productoData = [
        producto.nombre,
        producto.cantidad,
        `${precioMostrar.toFixed(2)} €`,
        `${producto.subtotal.toFixed(2)} €`,
      ];
      tableRows.push(productoData);
    });

    const footRows = [];

    if (pedido.descuento) {
      const descuentoAplicado = this.calcularDescuentoAplicado(pedido);
      footRows.push([
        'Descuento',
        `${pedido.descuento.cantidad}%`,
        '',
        `- ${descuentoAplicado.toFixed(2)} €`,
      ]);
    }

    footRows.push(['Total', '', '', `${pedido.total.toFixed(2)} €`]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 95,
      theme: 'striped',
      headStyles: {
        fillColor: [255, 74, 170],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      foot: footRows,
      footStyles: {
        fillColor: [255, 245, 248],
        textColor: [255, 74, 170],
        fontStyle: 'bold',
      },
      didDrawCell: (data) => {
        if (data.section === 'foot' && data.row.index === footRows.length - 1) {
          data.cell.styles.fillColor = [240, 240, 240];
          data.cell.styles.textColor = [0, 0, 0];
        }
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('Gracias por confiar en Cookies40', 105, finalY, {
      align: 'center',
    });

    doc.save(`Cookies40_Pedido_${pedido.id}.pdf`);
  }
}

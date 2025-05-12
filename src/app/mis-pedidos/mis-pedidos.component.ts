import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../services/pedido/pedido.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../services/producto/producto.service';

@Component({
  selector: 'app-mis-pedidos',
  imports: [CommonModule],
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
      const usuario = JSON.parse(sesion).usuario;
      this.nombreUsuario = usuario.nombre;
    }

    // Primero cargamos todos los productos para tener la información completa
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;

        // Después cargamos los pedidos
        this.pedidoService.getMisPedidos().subscribe({
          next: (pedidos) => {
            // Enriquecemos los pedidos con la información completa de los productos
            this.pedidos = pedidos.map((pedido) => {
              return {
                ...pedido,
                expanded: false,
                productos: pedido.productos.map((pedidoProducto: any) => {
                  const productoCompleto = this.productos.find(
                    (p) => p.id === pedidoProducto.idProducto
                  );

                  return {
                    ...pedidoProducto,
                    nombre: productoCompleto
                      ? productoCompleto.nombre
                      : 'Producto no disponible',
                    precio: productoCompleto ? productoCompleto.precio : 0,
                    imagen: productoCompleto ? productoCompleto.imagenUrl : '',
                    subtotal: productoCompleto
                      ? productoCompleto.precio * pedidoProducto.cantidad
                      : 0,
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
  togglePedido(pedido: any): void {
    pedido.expanded = !pedido.expanded;
  }

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

    // Tabla de productos
    doc.setFontSize(14);
    doc.text('Productos:', 20, 90);

    // Crear tabla de productos con autoTable
    const tableColumn = ['Producto', 'Cantidad', 'Precio', 'Subtotal'];
    const tableRows: any[] = [];

    pedido.productos.forEach((producto: any) => {
      const productoData = [
        producto.nombre,
        producto.cantidad,
        `${producto.precio.toFixed(2)} €`,
        `${producto.subtotal.toFixed(2)} €`,
      ];
      tableRows.push(productoData);
    });

    // Usa la librería autoTable correctamente
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
      foot: [['Total', '', '', `${pedido.total.toFixed(2)} €`]],
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
    });

    // Obtén la posición final después de la tabla
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('Gracias por confiar en Cookies40', 105, finalY, {
      align: 'center',
    });

    // Generar y descargar PDF
    doc.save(`Cookies40_Pedido_${pedido.id}.pdf`);
  }
}

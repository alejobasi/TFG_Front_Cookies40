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
  constructor(
    private productosService: ProductoService,
    private ingredienteService: IngredienteService
  ) {}
  ngOnInit(): void {
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
}

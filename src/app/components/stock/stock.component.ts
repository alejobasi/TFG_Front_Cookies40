import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { IngredienteService } from '../../services/ingrediente/ingrediente.service';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Ingrediente } from '../../models/Ingrediente';

@Component({
  selector: 'app-stock',
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent implements OnInit {
  constructor(
    private ingredienteService: IngredienteService,
    private cdr: ChangeDetectorRef
  ) {}

  displayedColumns: string[] = ['id', 'nombre', 'cantidad'];
  dataSource = new MatTableDataSource<Ingrediente>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ingredientes: any[] = [];
  ingredientesPrevios: any[] = [];
  page: number = 1;
  selectedFile: File | null = null;
  mensaje: string = '';
  mostrarMensaje: boolean = false;

  ngOnInit(): void {
    this.ingredienteService.getIngredientes().subscribe({
      next: (data) => {
        this.ingredientes = data;
        this.dataSource.data = this.ingredientes;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log('Ingredientes obtenidos:', this.ingredientes);
      },
      error: (error) => {
        console.error('Error al obtener ingredientes:', error);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cambioFichero(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Archivo seleccionado:', this.selectedFile);
    }
  }

  envioFichero(): void {
    this.ingredientesPrevios = [...this.ingredientes];
    console.log('Ingredientes previos:', this.ingredientesPrevios);
    if (this.selectedFile) {
      this.ingredienteService
        .actualizarIngredientes(this.selectedFile)
        .subscribe({
          next: (respuesta: any) => {
            console.log('Archivo subido exitosamente');
            this.mostrarMensajeTemporal(respuesta.mensaje);
            this.ingredienteService.getIngredientes().subscribe({
              next: (data) => {
                this.ingredientes = data;

                this.identificarActualizados();
              },
              error: (error) => {},
            });
          },
          error: (error: any) => {
            if (error.status == 400) {
              this.mostrarMensajeTemporal(error.error);
            }

            this.ngOnInit();
          },
        });
    }
  }

  mostrarMensajeTemporal(mensaje: string): void {
    this.mensaje = mensaje;
    this.mostrarMensaje = true;
    setTimeout(() => {
      this.mostrarMensaje = false;
    }, 3000);
  }

  ingredientesActualizados: Set<number> = new Set();
  identificarActualizados(): void {
    this.ingredientesActualizados.clear();

    this.ingredientes.forEach((nuevo) => {
      const previo = this.ingredientesPrevios.find((i) => i.id === nuevo.id);
      if (previo && previo.cantidad !== nuevo.cantidad) {
        this.ingredientesActualizados.add(nuevo.id);
        console.log(
          `Ingrediente actualizado: ID ${nuevo.id}, Cantidad anterior: ${previo.cantidad}, Cantidad nueva: ${nuevo.cantidad}`
        );
      }
    });

    setTimeout(() => {
      this.ingredientesActualizados.clear();
      this.cdr.detectChanges();
    }, 3000);
  }

  esActualizado(id: number): boolean {
    return this.ingredientesActualizados.has(id);
  }
}

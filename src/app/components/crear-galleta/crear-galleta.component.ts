import { Component, OnInit } from '@angular/core';
import { IngredienteService } from '../../services/ingrediente/ingrediente.service';
import { Ingrediente } from '../../models/Ingrediente';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-crear-galleta',
  imports: [CommonModule],
  templateUrl: './crear-galleta.component.html',
  styleUrl: './crear-galleta.component.css',
})
export class CrearGalletaComponent implements OnInit {
  ingredientes: Ingrediente[] = [];
  ingredientesSobreGalleta: any[] = [];
  precioTotal: number = 0;

  constructor(private ingredienteServices: IngredienteService) {}

  ngOnInit(): void {
    this.ingredienteServices.getIngredientes().subscribe({
      next: (data) => {
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
}

import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ProductoService } from '../../services/producto/producto.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-subir-imagen',
  imports: [CommonModule],
  templateUrl: './modal-subir-imagen.component.html',
  styleUrl: './modal-subir-imagen.component.css',
})
export class ModalSubirImagenComponent {
  @Input() productoId!: number;
  @Output() imagenSubida = new EventEmitter<string>(); // Emite la URL de la imagen subida
  imagenSeleccionada!: File;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private productoService: ProductoService) {}

  onFileSelected(event: any): void {
    this.imagenSeleccionada = event.target.files[0];
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const box = event.target as HTMLElement;
    box.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    const box = event.target as HTMLElement;
    box.classList.remove('drag-over');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const box = event.target as HTMLElement;
    box.classList.remove('drag-over');

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.imagenSeleccionada = event.dataTransfer.files[0];
      console.log('Imagen arrastrada:', this.imagenSeleccionada);
    }
  }

  subirImagen(): void {
    console.log(this.imagenSeleccionada);
    if (this.imagenSeleccionada) {
      this.productoService
        .subirImagenProducto(this.productoId, this.imagenSeleccionada)
        .subscribe(
          (response) => {
            console.log('Imagen subida:', response);
            Swal.fire({
              icon: 'success',
              title: 'Imagen subida correctamente',
              text: 'La imagen se ha subido correctamente.',
            });
            this.cerrarModal();
          },
          (error) => {
            console.error('Error al subir la imagen:', error);
            this.cerrarModal();
          }
        );
    }
  }

  abrirSelectorDeArchivos() {
    this.fileInput.nativeElement.click();
  }

  cerrarModal(): void {
    const modal = document.getElementById('modalSubirImagen');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }
  }
}

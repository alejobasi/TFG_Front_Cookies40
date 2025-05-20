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
import { SupabaseService } from '../../services/supabase/supabase.service';

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

  constructor(
    private productoService: ProductoService,
    private supabaseService: SupabaseService
  ) {}

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
      // Genera un nombre de archivo único usando el ID del producto y timestamp
      const timestamp = new Date().getTime();
      const filename = `producto_${this.productoId}_${timestamp}`;
      const extension = this.imagenSeleccionada.name.split('.').pop();
      const path = `${filename}.${extension}`;

      // Sube a Supabase storage
      this.supabaseService
        .uploadImage('cookies40', path, this.imagenSeleccionada)
        .subscribe(
          (imageUrl) => {
            console.log('Imagen subida a Supabase:', imageUrl);
            this.productoService
              .subirImagenProducto(this.productoId, imageUrl)
              .subscribe(
                (response) => {
                  console.log('Imagen subida al producto:', response);
                  Swal.fire({
                    imageUrl: imageUrl,
                    title: 'Imagen subida',
                    text: 'La imagen se ha subido correctamente.',
                  });
                  this.imagenSubida.emit(imageUrl); // Emitir la URL de la imagen
                },
                (error) => {
                  console.error('Error al subir la imagen al producto:', error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Error al subir la imagen',
                    text: 'Ha ocurrido un error al subir la imagen al producto.',
                  });
                }
              );
            this.cerrarModal();
          },
          (error) => {
            console.error('Error al subir la imagen a Supabase:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al subir la imagen',
              text: 'Ha ocurrido un error al subir la imagen a Supabase.',
            });
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

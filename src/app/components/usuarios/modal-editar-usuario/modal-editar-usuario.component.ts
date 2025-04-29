import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Usuario } from '../../../models/Usuario';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-editar-usuario',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal-editar-usuario.component.html',
  styleUrl: './modal-editar-usuario.component.css',
})
export class ModalEditarUsuarioComponent implements OnChanges {
  @Input() usuario!: Usuario;

  usuarioForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] && this.usuario) {
      this.initForm();
    }
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [
        { value: this.usuario.email, disabled: true },
        [Validators.required, Validators.email],
      ],
      contrasena: [''],
      rol: [{ value: this.usuario.rol.nombre, disabled: true }],
    });
  }
  cerrarModal(): void {
    const modal = document.getElementById('modalEditarUsuario');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }
  }

  guardarCambios(): void {
    if (this.usuarioForm.valid) {
      const usuarioActualizado: Usuario = {
        ...this.usuario,
        ...this.usuarioForm.value,
      };

      // Si la contraseña está vacía, no se envía al backend
      if (!this.usuarioForm.value.contrasena) {
        delete usuarioActualizado.contrasena;
      }

      console.log('Usuario actualizado:', usuarioActualizado);

      this.usuarioService.actualizarUsuario(usuarioActualizado).subscribe({
        next: (response) => {
          console.log('Usuario actualizado correctamente:', response);

          this.cerrarModal();
          Swal.fire({
            title: 'Usuario actualizado',
            text: 'Los cambios se han guardado correctamente.',
            color: '#ff4aaa',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
        },
      });
    }
  }
}

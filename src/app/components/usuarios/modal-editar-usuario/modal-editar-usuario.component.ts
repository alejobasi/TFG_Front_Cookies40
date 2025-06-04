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
  AbstractControl,
  ValidationErrors,
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

  // Validador condicional para contraseña
  validarContrasenaFuerte(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Si está vacío, es válido (la contraseña es opcional)
    if (!value) {
      return null;
    }

    // Si tiene valor, verificamos los requisitos
    const tieneMinuscula = /[a-z]/.test(value);
    const tieneMayuscula = /[A-Z]/.test(value);
    const tieneNumero = /[0-9]/.test(value);
    const tieneLongitudMinima = value.length >= 8;

    const contrasenaValida =
      tieneMinuscula && tieneMayuscula && tieneNumero && tieneLongitudMinima;

    return contrasenaValida
      ? null
      : {
          contrasenaDebil: {
            tieneMinuscula,
            tieneMayuscula,
            tieneNumero,
            tieneLongitudMinima,
          },
        };
  }

  // Método para verificar los requisitos en la plantilla
  verificarRequisito(campo: string, requisito: string): boolean {
    const control = this.usuarioForm.get(campo);

    // Si el campo está vacío, todos los requisitos están "cumplidos" (porque no aplicamos validación)
    if (!control?.value) {
      return true;
    }

    // Si no tiene errores de tipo contrasenaDebil, está cumplido
    if (!control.errors || !control.errors['contrasenaDebil']) {
      return true;
    }

    // Devuelve el estado del requisito específico
    return control.errors['contrasenaDebil'][requisito];
  }

  // Verificar longitud mínima de forma separada
  verificarLongitudMinima(campo: string): boolean {
    const control = this.usuarioForm.get(campo);
    if (!control?.value) {
      return true;
    }
    return control.value.length >= 8;
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [
        { value: this.usuario.email, disabled: true },
        [Validators.required, Validators.email],
      ],
      contrasena: ['', [this.validarContrasenaFuerte.bind(this)]],
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

  // Ver contraseña (toggle)
  verContrasena(): void {
    const input = document.getElementById('contrasena') as HTMLInputElement;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
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
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
        },
      });
    }
  }
}

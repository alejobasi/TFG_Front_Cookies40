import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalLoginService } from '../../services/modal-login/modal-login.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-registro',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-registro.component.html',
  styleUrl: './modal-registro.component.css',
})
export class ModalRegistroComponent implements OnInit {
  formularioRegistro: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected modalLoginService: ModalLoginService,
    private usuarioService: UsuarioService
  ) {
    this.formularioRegistro = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.modalLoginService.registroModalState$.subscribe((state) => {
      const modal = document.getElementById('registroModal');
      const contenido = document.querySelector('.contenido');
      if (modal) {
        if (state) {
          modal.classList.add('show');
          modal.style.display = 'block';
          modal.setAttribute('aria-modal', 'true');
          modal.removeAttribute('aria-hidden');
          if (contenido) {
            contenido.classList.add('desenfoque');
          }
        } else {
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
          if (contenido) {
            contenido.classList.remove('desenfoque');
          }
        }
      }
    });
  }

  verContrasena(field: string): void {
    const input = document.getElementById(field) as HTMLInputElement;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }

  registrarse(): void {
    if (this.formularioRegistro.valid) {
      const { nombre, email, contrasena, confirmPassword } =
        this.formularioRegistro.value;
      if (contrasena !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden',
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
      const usuario = { nombre, email, contrasena };
      this.usuarioService
        .registrarUsuario(usuario, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            console.log(response);
            Swal.fire({
              imageAlt: 'cookies40',
              imageUrl: 'assets/images/logo.png',
              imageHeight: 100,
              imageWidth: 385,
              title: 'Registro exitoso',
              text: 'Usuario registrado correctamente.',
              color: '#fc60e2',
              showConfirmButton: false,
              timer: 1500,
            });
            this.modalLoginService.closeRegistroModal();
            this.formularioRegistro.reset();
            this.modalLoginService.openModal();
          },
          error: (error) => {
            Swal.fire({
              imageAlt: 'cookies40',
              imageUrl: 'assets/images/logo.png',
              imageHeight: 100,
              imageWidth: 385,
              title: 'Error al registrar',
              text: 'Ocurrió un error al registrar el usuario.',
              color: '#fc60e2',
              showConfirmButton: true,
            });
            console.error(error);
          },
        });
    }
  }
}

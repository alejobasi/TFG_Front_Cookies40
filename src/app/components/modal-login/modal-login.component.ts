import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalLoginService } from '../../services/modal-login/modal-login.service';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { routes } from '../../app.routes';
import { Router, RouterLinkWithHref } from '@angular/router';
import { ComprobacionAdminService } from '../../services/Comprobacion-admin/comprobacion-admin.service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css'],
})
export class ModalLoginComponent implements OnInit {
  formularioLogin: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected modalLoginService: ModalLoginService,
    private usuarioService: UsuarioService,
    private router: Router,
    private adminService: ComprobacionAdminService
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.modalLoginService.modalState$.subscribe((state) => {
      const modal = document.getElementById('loginModal');
      const contenido = document.querySelector('.contenido');
      if (modal) {
        if (state) {
          modal.classList.add('show');
          modal.style.display = 'block';
          modal.setAttribute('aria-modal', 'true');
          modal.removeAttribute('aria-hidden');
          modal.focus();
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

    const mostrarSwal = localStorage.getItem('mostrarSwal');
    if (mostrarSwal) {
      Swal.fire({
        showConfirmButton: false,
        title: 'Inicio de sesión exitoso',
        text: 'Bienvenido de nuevo',
        color: '#fc60e2',
        timer: 1500,
        timerProgressBar: true,
      });
      localStorage.removeItem('mostrarSwal');
    }
  }

  verContrasena(field: string): void {
    const input = document.getElementById(field) as HTMLInputElement;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }

  iniciarSesion(): void {
    if (this.formularioLogin.valid) {
      const { email, contrasena } = this.formularioLogin.value;
      const usuario = { email, contrasena };
      this.usuarioService.loginUsuario(usuario).subscribe(
        (response) => {
          const token = response.token;
          const decodedToken: any = jwtDecode(token);
          localStorage.setItem('sesion', JSON.stringify(response));
          this.modalLoginService.closeModal();
          this.usuarioService
            .comprobarRolAdmin(decodedToken.sub)
            .subscribe((rol) => {
              if (rol === 2) {
                this.adminService.setEsAdmin(true);
                this.router.navigate(['/admin']);
              } else {
                window.location.reload();
                localStorage.setItem('mostrarSwal', 'true');
              }
            });
        },
        (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario o contraseña incorrecta',
            confirmButtonText: 'Aceptar',
          });
        }
      );
    }
  }

  abrirRecuperarContrasena() {
    this.modalLoginService.closeModal();
    this.modalLoginService.openRecuperarContrasenaModal();
  }

  abrirRegistro(): void {
    this.modalLoginService.closeModal();
    this.modalLoginService.openRegistroModal();
  }
}

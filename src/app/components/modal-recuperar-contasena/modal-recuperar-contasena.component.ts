import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalLoginService } from '../../services/modal-login/modal-login.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-recuperar-contasena',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-recuperar-contasena.component.html',
  styleUrl: './modal-recuperar-contasena.component.css'
})
export class ModalRecuperarContasenaComponent  implements OnInit {
  formularioRecuperar: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected modalLoginService: ModalLoginService,
    private usuarioService: UsuarioService
  ) {
    this.formularioRecuperar = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.modalLoginService.recuperarContrasenaModalState$.subscribe(state => {
      const modal = document.getElementById('recuperarContrasenaModal');
      if (modal) {
        if (state) {
          modal.classList.add('show');
          modal.style.display = 'block';
          modal.setAttribute('aria-modal', 'true');
          modal.removeAttribute('aria-hidden');
          modal.focus();
        } else {
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
        }
      }
    });
  }

  enviarCorreo(): void {
    if (this.formularioRecuperar.valid) {
      const correo = this.formularioRecuperar.value.correo;
      this.usuarioService.codigoVerificacionCabiarContrasena(correo).subscribe(
        (response) => {
          Swal.fire({
            imageAlt: "cookies40",
            imageUrl: "assets/images/logo.png",
            imageHeight: 100,
            imageWidth: 385,
            title: 'Clave de recuperación enviada',
            text: 'La clave de recuperación ha sido enviada a tu correo.',
            color: '#fc60e2',
            showConfirmButton: false,
            timer: 2500
                   });
          this.modalLoginService.closeRecuperarContrasenaModal();
          this.modalLoginService.openCambiarContrasenaModal(correo);
        },
        (error) => {
          Swal.fire({
            imageAlt: "cookies40",
            imageUrl: "assets/images/logo.png",
            imageHeight: 100,
            imageWidth: 385,
            title: 'Clave de recuperación enviada',
            text: 'La clave de recuperación ha sido enviada a tu correo.',
            color: '#fc60e2',
            showConfirmButton: false,
            timer: 2500
          });
          this.modalLoginService.closeRecuperarContrasenaModal();
          this.modalLoginService.openCambiarContrasenaModal(correo);
        }
      );
    }
  }
}

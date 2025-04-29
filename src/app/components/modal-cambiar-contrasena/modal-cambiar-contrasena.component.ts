import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalLoginService } from '../../services/modal-login/modal-login.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-cambiar-contrasena',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-cambiar-contrasena.component.html',
  styleUrl: './modal-cambiar-contrasena.component.css'
})
export class ModalCambiarContrasenaComponent implements OnInit {
  formularioCambiar: FormGroup;
  correo: string = '';

  constructor(
    private fb: FormBuilder,
    protected modalLoginService: ModalLoginService,
    private usuarioService: UsuarioService
  ) {
    this.formularioCambiar = this.fb.group({
      codigo: ['', Validators.required],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.modalLoginService.cambiarContrasenaModalState$.subscribe(({ state, correo }) => {
      const modal = document.getElementById('cambiarContrasenaModal');
      if (modal) {
        if (state) {
          this.correo = correo || '';
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

  cambiarContrasena(): void {
    if (this.formularioCambiar.valid) {
      const { codigo, nuevaContrasena } = this.formularioCambiar.value;
      const envio = { correo: this.correo, codigo, nuevaContrasena };
      this.usuarioService.cambiarContrasena(envio).subscribe(
        (response) => {
          
          Swal.fire({
            imageAlt: "cookies40",
            imageUrl: "assets/images/logo.png",
            imageHeight: 100,
            imageWidth: 385,
            title: 'Contraseña cambiada',
            text: 'La contraseña ha sido cambiada con éxito.',
            color: '#fc60e2', 
            showConfirmButton: false,
            timer: 2500
          });

          this.modalLoginService.closeCambiarContrasenaModal();
        },
        (error) => {
          this.modalLoginService.closeCambiarContrasenaModal();
        }
      );
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/Usuario';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { timeout } from 'rxjs';
import { ModalEditarUsuarioComponent } from './modal-editar-usuario/modal-editar-usuario.component';

@Component({
  selector: 'app-usuarios',
  imports: [NgxPaginationModule, CommonModule, ModalEditarUsuarioComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  constructor(private usuarioService: UsuarioService) {}
  page: number = 1;
  usuarios: Usuario[] = [];
  usuarioSeleccionado!: Usuario;
  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.filter(
          (usuario) => usuario.rol.nombre !== 'ADMINISTRADOR'
        );
        console.log('Usuarios obtenidos:', this.usuarios);
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      },
    });
  }

  abrirModalEditar(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    const modal = document.getElementById('modalEditarUsuario');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true');
    }
  }

  eliminarUsuario(id: number | null) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(id!).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado!',
              text: 'El usuario ha sido eliminado.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            this.usuarios = this.usuarios.filter(
              (usuario) => usuario.id !== id
            );
          },
          error: (error) => {
            console.error('Error al eliminar el usuario:', error);
          },
        });
      }
    });
  }
}

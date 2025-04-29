import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { ModalLoginComponent } from './components/modal-login/modal-login.component';
import { ModalRegistroComponent } from './components/modal-registro/modal-registro.component';
import { ModalRecuperarContasenaComponent } from './components/modal-recuperar-contasena/modal-recuperar-contasena.component';

import { NavAdminComponent } from './components/nav-admin/nav-admin.component';
import { CommonModule } from '@angular/common';
import { ComprobacionAdminService } from './services/Comprobacion-admin/comprobacion-admin.service';
import { ModalCambiarContrasenaComponent } from './components/modal-cambiar-contrasena/modal-cambiar-contrasena.component';
import { ModalDireccionEntregaComponent } from './components/modal-direccion-entrega/modal-direccion-entrega.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ModalLoginComponent,
    ModalRegistroComponent,
    ModalRecuperarContasenaComponent,
    NavComponent,
    NavAdminComponent,
    CommonModule,
    ModalCambiarContrasenaComponent,
    ModalDireccionEntregaComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  esAdmin: boolean = false;

  constructor(
    private adminService: ComprobacionAdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.adminService.esAdmin$.subscribe((isAdmin) => {
      this.esAdmin = isAdmin;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Current URL:', event.url); // Depuración: Verifica la URL actual

        if (event.urlAfterRedirects.includes('/home')) {
          console.log('Applying overflowY: hidden to <html>'); // Depuración
          document.documentElement.style.overflowY = 'hidden'; // Cambia el estilo de <html>
        } else {
          console.log('Applying overflowY: auto to <html>'); // Depuración
          document.documentElement.style.overflowY = 'auto'; // Cambia el estilo de <html>
        }
      }
    });
  }
}

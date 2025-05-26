import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const sesion = localStorage.getItem('sesion');
    if (sesion === null) {
      window.location.href = '/home';
    }
    const sesionObj = sesion ? JSON.parse(sesion) : null;
    const rol = sesionObj?.usuario?.rol;
    if (rol.id !== 2) {
      window.location.href = '/home';
    }
  }
}

import { Rol } from './Rol';

export class Usuario {
  id: number | null;
  nombre: string;
  email: string;
  contrasena?: string;
  rol: Rol;

  constructor(
    id: number | null,
    nombre: string,
    email: string,
    contrasena: string,
    rol: Rol
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.contrasena = contrasena;
    this.rol = rol;
  }
}

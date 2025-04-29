import { RoleList } from './RoleList';

export class Rol {
  id: number;
  nombre: RoleList;

  constructor(id: number, nombre: RoleList) {
    this.id = id;
    this.nombre = nombre;
  }
}

export class Familia {
  id: number;
  nombre: string;

  constructor (id: number, nombre: string) {
    this.id = id;
    this.nombre = nombre;
    }

  getId () {
    return this.id;
  }

  getNombre () {
    return this.nombre;
  }

}
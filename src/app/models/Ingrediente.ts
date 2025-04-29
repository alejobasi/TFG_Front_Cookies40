export class Ingrediente{
    id: number;
    nombre: string;
    imagen: string;
    cantidad: number;
    
    constructor(id: number, nombre: string, imagen: string, cantidad: number) {
        this.id = id;
        this.nombre = nombre;
        this.imagen = imagen;
        this.cantidad = cantidad;
    }
    getNombre() {
        return this.nombre;
    }
    getId() {
        return this.id;
    }
    getImagen() {
        return this.imagen;
    }
    getCantidad() {
        return this.cantidad;
    }
    setCantidad(cantidad: number) {
        this.cantidad = cantidad;
    }
    setNombre(nombre: string) {
        this.nombre = nombre;
    }
    setId(id: number) {
        this.id = id;
    }
    setImagen(imagen: string) {
        this.imagen = imagen;
    }
}
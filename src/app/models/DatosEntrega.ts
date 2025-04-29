export class DatosEntrega {
    id!: number | null; 
    idUsuario!: number; 
    calle!: string;
    numero!: number;
    piso!: string;
    telefono!: string;

   
    constructor() {
        this.id = null;
        this.idUsuario = 0;
        this.calle = '';
        this.numero = 0;
        this.piso = '';
        this.telefono = '';
    }

    getId(): number {
        if (this.id === null) {
            throw new Error('ID is null');
        }
        return this.id;
    }
    setId(id: number): void {
        this.id = id;
    }
    getIdUsuario(): number {
        return this.idUsuario;
    }
    setIdUsuario(idUsuario: number): void {
        this.idUsuario = idUsuario;
    }
    getCalle(): string {
        return this.calle;
    }
    setCalle(calle: string): void {
        this.calle = calle;
    }
    getNumero(): number {
        return this.numero;
    }
    setNumero(numero: number): void {
        this.numero = numero;
    }
    getPiso(): string {
        return this.piso;
    }
    setPiso(piso: string): void {
        this.piso = piso;
    }
    getTelefono(): string {
        return this.telefono;
    }
    setTelefono(telefono: string): void {
        this.telefono = telefono;
    }
   
}
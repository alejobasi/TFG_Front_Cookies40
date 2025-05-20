import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DescuentoService } from '../../services/descuento/descuento.service';
import { Descuento } from '../../models/Descuento';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-sorteo-descuento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sorteo-descuento.component.html',
  styleUrl: './sorteo-descuento.component.css',
})
export class SorteoDescuentoComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  puedeGirar: boolean = true;
  tiempoRestante: string = '';
  intervaloTiempo: any;
  tiempoFinalizacion: Date | null = null;
  tieneDescuentoSinUsar: boolean = false;
  descuentoActual: any = null;

  constructor(
    private descuentoService: DescuentoService,
    private usuarioService: UsuarioService
  ) {}

  opcionesRuleta: { valor: number | string; texto: string; color: string }[] =
    [];

  descuentosDB: Descuento[] = [];

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    this.verificarDescuentoActivo();
    // Obtenemos los descuentos de la base de datos
    this.descuentoService.getDescuentos().subscribe({
      next: (data) => {
        this.descuentosDB = data;
        console.log('Descuentos obtenidos:', this.descuentosDB);

        // Convertimos los descuentos de la BD al formato de la ruleta
        this.opcionesRuleta = this.mapearDescuentos(this.descuentosDB);

        // Actualizamos el arco y dibujamos la ruleta
        this.arc = (Math.PI * 2) / this.opcionesRuleta.length;

        if (this.ctx) {
          this.dibujarRuleta();
        }
      },
      error: (error) => {
        console.error('Error al obtener descuentos:', error);
        // Si hay error, usamos los datos por defecto
      },
    });
  }

  ngOnDestroy(): void {
    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
    }
  }

  verificarDescuentoActivo(): void {
    const sesion = localStorage.getItem('sesion');
    if (!sesion) return;

    const usuario = JSON.parse(sesion).usuario;
    if (!usuario) return;

    // Verificar si el usuario tiene un descuento sin usar
    if (usuario.descuento) {
      this.descuentoActual = usuario.descuento;
      this.tieneDescuentoSinUsar = true;
      this.puedeGirar = false;
      return; // No continuar con la verificación de tiempo si hay descuento sin usar
    }

    // Si llega aquí, no tiene descuento sin usar, verificar restricción de tiempo
    if (!usuario.fechaSorteo) return;

    // Convertir fecha de string a Date
    const fechaSorteo = new Date(usuario.fechaSorteo);
    // Añadir 7 días a la fecha del sorteo
    const fechaLimite = new Date(fechaSorteo);
    fechaLimite.setDate(fechaLimite.getDate() + 7);

    const ahora = new Date();

    if (ahora < fechaLimite) {
      // El usuario todavía está en el período de espera
      this.puedeGirar = false;
      this.tiempoFinalizacion = fechaLimite;

      // Iniciar la cuenta atrás
      this.iniciarCuentaAtras();
    }
  }

  iniciarCuentaAtras(): void {
    if (!this.tiempoFinalizacion) return;

    this.actualizarTiempoRestante();

    this.intervaloTiempo = setInterval(() => {
      this.actualizarTiempoRestante();
    }, 1000); // Actualizar cada segundo
  }

  actualizarTiempoRestante(): void {
    if (!this.tiempoFinalizacion) return;

    const ahora = new Date();
    const diferencia = this.tiempoFinalizacion.getTime() - ahora.getTime();

    if (diferencia <= 0) {
      // El tiempo ha terminado
      this.puedeGirar = true;
      clearInterval(this.intervaloTiempo);
      this.tiempoRestante = '';
      return;
    }

    // Calcular días, horas, minutos y segundos
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    this.tiempoRestante = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }
  // Opciones de descuento
  mapearDescuentos(
    descuentos: Descuento[]
  ): { valor: number | string; texto: string; color: string }[] {
    const colores = ['#ff78c4', '#ffe4e1']; // Colores alternos

    return descuentos.map((d, index) => {
      return {
        valor: d.cantidad,
        texto: `${d.cantidad}% DTO`,
        color: colores[index % 2],
      };
    });
  }
  // Variables para controlar la ruleta
  private ctx!: CanvasRenderingContext2D;
  private startAngle = 0;
  private arc = 0;
  private spinTimeout: any;
  private spinArcStart = 10;
  private spinTime = 0;
  private spinTimeTotal = 0;

  girando = false;
  resultadoDescuento: any = null;
  mostrarResultado = false;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Ajustar el tamaño del canvas al tamaño del contenedor
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    this.dibujarRuleta();
  }

  dibujarRuleta() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el fondo de la ruleta
    this.ctx.strokeStyle = '#ff4aaa';
    this.ctx.lineWidth = 2;

    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';

    const radius = canvas.width / 2 - 20;

    for (let i = 0; i < this.opcionesRuleta.length; i++) {
      const angle = this.startAngle + i * this.arc;
      this.ctx.fillStyle = this.opcionesRuleta[i].color;

      // Dibujar el sector
      this.ctx.beginPath();
      this.ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        radius,
        angle,
        angle + this.arc,
        false
      );
      this.ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        0,
        angle + this.arc,
        angle,
        true
      );
      this.ctx.fill();
      this.ctx.stroke();

      // Dibujar el texto
      this.ctx.save();
      this.ctx.fillStyle =
        this.opcionesRuleta[i].color === '#ffe4e1' ? '#ff4aaa' : 'white';
      this.ctx.translate(
        canvas.width / 2 + Math.cos(angle + this.arc / 2) * radius * 0.6,
        canvas.height / 2 + Math.sin(angle + this.arc / 2) * radius * 0.6
      );
      this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
      this.ctx.fillText(this.opcionesRuleta[i].texto, 0, 0);
      this.ctx.restore();
    }

    // Dibujar la flecha
    this.ctx.fillStyle = '#ff4aaa';
    this.ctx.beginPath();
    this.ctx.moveTo(canvas.width / 2 - 10, canvas.height / 2 - radius - 15);
    this.ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2 - radius - 15);
    this.ctx.lineTo(canvas.width / 2, canvas.height / 2 - radius + 5);
    this.ctx.fill();

    // Círculo central
    this.ctx.beginPath();
    this.ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      40,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.fillStyle = '#ff78c4';
    this.ctx.fill();
    this.ctx.stroke();

    // Borde de la ruleta
    this.ctx.beginPath();
    this.ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      radius,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.stroke();
  }

  girarRuleta() {
    if (this.girando || !this.puedeGirar) return;

    // Resto del código existente
    this.girando = true;
    this.resultadoDescuento = null;
    this.mostrarResultado = false;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3000 + 4000; // Entre 4 y 7 segundos
    this.rotar();
  }

  rotar() {
    this.spinTime += 30;
    if (this.spinTime >= this.spinTimeTotal) {
      this.detenerRotacion();
      return;
    }

    const easeOut = (t: number, b: number, c: number, d: number) => {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    };

    const spinAngle = easeOut(
      this.spinTime,
      0,
      this.spinArcStart,
      this.spinTimeTotal
    );
    this.startAngle += (spinAngle * Math.PI) / 180;
    this.dibujarRuleta();
    this.spinTimeout = setTimeout(() => this.rotar(), 30);
  }

  detenerRotacion() {
    clearTimeout(this.spinTimeout);

    // Calcular el sector ganador
    const degrees = (this.startAngle * 180) / Math.PI + 90;
    const arcd = (this.arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);

    // Obtener el resultado
    this.resultadoDescuento = this.opcionesRuleta[index];
    this.mostrarResultado = true;
    this.girando = false;

    // Guardar el descuento ganado para el usuario
    this.guardarDescuentoUsuario(index);
  }
  // Reemplazar el método guardarDescuentoUsuario por este:

  guardarDescuentoUsuario(indice: number) {
    const sesion = localStorage.getItem('sesion');
    if (!sesion) {
      console.log('Usuario no autenticado, no se puede guardar el descuento');
      return;
    }

    const usuario = JSON.parse(sesion).usuario;

    if (this.descuentosDB.length > 0 && indice < this.descuentosDB.length) {
      const descuentoGanado = this.descuentosDB[indice];
      console.log(
        `El usuario ha ganado el descuento: ${descuentoGanado.nombre}`
      );

      const descuentoId = descuentoGanado.id;

      // Primero, asignar el descuento
      this.usuarioService
        .asignarDescuentoUsuario(usuario.id, descuentoId)
        .subscribe({
          next: (usuarioActualizado) => {
            console.log(
              'Descuento asignado correctamente:',
              usuarioActualizado
            );

            // Después de asignar, actualizar el localStorage con el descuento y su fecha
            this.usuarioService.getDescuentosUsuario(usuario.id).subscribe({
              next: (descuentoFecha) => {
                const sesionActual = JSON.parse(sesion);
                if (sesionActual.usuario) {
                  sesionActual.usuario.descuento = descuentoFecha.descuento;
                  sesionActual.usuario.fechaSorteo = descuentoFecha.fecha;
                  localStorage.setItem('sesion', JSON.stringify(sesionActual));

                  // Iniciar la cuenta atrás después de guardar el descuento
                  this.puedeGirar = false;

                  const fechaSorteo = new Date(descuentoFecha.fecha);
                  const fechaLimite = new Date(fechaSorteo);
                  fechaLimite.setDate(fechaLimite.getDate() + 7);

                  this.tiempoFinalizacion = fechaLimite;
                  this.iniciarCuentaAtras();
                }
              },
              error: (error) => {
                console.error(
                  'Error al obtener detalles del descuento:',
                  error
                );
              },
            });
          },
          error: (error) => {
            console.error('Error al asignar el descuento:', error);
          },
        });
    }
  }
}

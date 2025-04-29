import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalLoginService {

  private cambiarContrasenaModalState = new Subject<{ state: boolean; correo?: string }>();
  private modalState = new Subject<boolean>();
  private registroModalState = new Subject<boolean>();
  private recuperarContrasenaModalState = new Subject<boolean>();

  modalState$ = this.modalState.asObservable();
  registroModalState$ = this.registroModalState.asObservable();
  recuperarContrasenaModalState$ = this.recuperarContrasenaModalState.asObservable();
  cambiarContrasenaModalState$ = this.cambiarContrasenaModalState.asObservable();


  constructor() { }

  openModal() {
    this.modalState.next(true);
  }

  closeModal() {
    this.modalState.next(false);
  }

  openRegistroModal() {
    this.registroModalState.next(true);
  }

  closeRegistroModal() {
    this.registroModalState.next(false);
  }

  openRecuperarContrasenaModal() {
    this.recuperarContrasenaModalState.next(true);
  }
  
  closeRecuperarContrasenaModal() {
    this.recuperarContrasenaModalState.next(false);
  }
  openCambiarContrasenaModal(correo: string) {
    this.cambiarContrasenaModalState.next({ state: true, correo });
  }
  closeCambiarContrasenaModal() {
    this.cambiarContrasenaModalState.next({ state: false });
  }
}

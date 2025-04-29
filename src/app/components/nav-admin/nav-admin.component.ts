import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component';
import { ComprobacionAdminService } from '../../services/Comprobacion-admin/comprobacion-admin.service';

@Component({
  selector: 'app-nav-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-admin.component.html',
  styleUrl: './nav-admin.component.css'
})
export class NavAdminComponent {
  constructor(private router: Router, private adminService: ComprobacionAdminService) {}

  cerrarSesion() {
    this.adminService.cerrarSesion();
    
    this.router.navigate(['/']); 
    
    
  }
}
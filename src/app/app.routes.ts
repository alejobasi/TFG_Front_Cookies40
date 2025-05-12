import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TiendaComponent } from './components/tienda/tienda.component';
import { AdminComponent } from './components/admin/admin.component';
import { StockComponent } from './components/stock/stock.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { Producto } from './models/Producto';
import { ProductosAdminComponent } from './components/productos-admin/productos-admin.component';
import { CrearGalletaComponent } from './components/crear-galleta/crear-galleta.component';
import { MisPedidosComponent } from './mis-pedidos/mis-pedidos.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'stock', component: StockComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'productos', component: ProductosAdminComponent },
  { path: 'crearGalleta', component: CrearGalletaComponent },
  { path: 'pedidos', component: MisPedidosComponent },
  { path: '**', redirectTo: 'home' },
];

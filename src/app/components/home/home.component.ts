import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CarouselModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  pulso(): void {
    const body = document.body;

    body.classList.add('pulse-effect');
    setTimeout(() => {
      body.classList.remove('pulse-effect');
    }, 1000);
  }
}

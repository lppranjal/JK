// src/app/service-detail.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-container">
      <h2>Service Details</h2>
      <p>Service ID: {{ serviceId }}</p>
      <!-- Load host/service–specific content here based on the ID -->
    </div>
  `,
  styles: [`
    .detail-container { padding: 20px; }
  `]
})
export class ServiceDetailComponent {
  serviceId: string | null = '';

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.serviceId = params.get('id');
    });
  }
}

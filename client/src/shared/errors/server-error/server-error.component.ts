import { Component, inject } from '@angular/core';
import { ApiError } from '../../../types/error';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css',
})
export class ServerErrorComponent {
  protected error: ApiError;
  private router = inject(Router);
  protected showDetails = false;

  constructor() {
    //only be accessed on consturctor
    const navigationExtras = this.router.currentNavigation();
    this.error = navigationExtras?.extras?.state?.['error'];
  }

  getDetails() {
    this.showDetails = !this.showDetails;
  }
}

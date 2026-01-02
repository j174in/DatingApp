import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private router = inject(Router);
  constructor() {
    this.createToastContainer();
  }
  private createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.classList.add(
        'toast',
        'toast-bottom',
        'toast-end',
        'z-50'
      );
      document.body.appendChild(toastContainer);
    }
  }
  private createToastElement(
    message: string,
    alertClass: string,
    duration = 5000,
    avatar?: string,
    route?: string
  ) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add(
      'alert',
      alertClass,
      'shadow-lg',
      'flex',
      'items-center',
      'gap-3',
      'cursor-pointer'
    );

    if (route) {
      toast.addEventListener('click', () => this.router.navigateByUrl(route));
    }

    toast.innerHTML = `
    ${
      avatar
        ? `<img src=${avatar || '/user.png'} class='w-10 h-10 rounded'`
        : ''
    }
    <span>${message}</span>
    <button class="btn btn-ghost ml-4 btn-sm ">x</button>
    `;
    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });
    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, duration);
  }

  success(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-success', duration, avatar, route);
  }

  error(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-error', duration, avatar, route);
  }

  warning(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-warning', duration, avatar, route);
  }

  info(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-info', duration, avatar, route);
  }
}

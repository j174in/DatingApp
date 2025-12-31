import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
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
    duration = 5000
  ) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg');
    toast.innerHTML = `
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

  success(message: string, duration?: number) {
    this.createToastElement(message, 'alert-success', duration);
  }

  error(message: string, duration?: number) {
    this.createToastElement(message, 'alert-error', duration);
  }

  warning(message: string, duration?: number) {
    this.createToastElement(message, 'alert-warning', duration);
  }

  info(message: string, duration?: number) {
    this.createToastElement(message, 'alert-info', duration);
  }
}

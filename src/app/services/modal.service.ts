import { Injectable } from '@angular/core';
declare var bootstrap: any;

@Injectable({
      providedIn: 'root'
})
export class ModalService {
      private currentModal: any = null;

      private closeCurrentModal(): void {
            if (this.currentModal) {
                  this.currentModal.hide();
                  this.currentModal = null;
            }
      }

      openLoginModal(): void {
            this.closeCurrentModal();
            const modalElement = document.getElementById('ct_login_modal') as HTMLElement;
            this.currentModal = new bootstrap.Modal(modalElement);
            this.currentModal.show();
      }

}

import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'setup';
  showLoader = false;
  private subscription!: Subscription;

  constructor(private router: Router, private loaderService: LoaderService, private notificationService: NotificationService) {
  }
  ngOnInit() {

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        this.notificationService.requestPermission()
      }
    });

    this.subscription = this.loaderService.showLoader$.subscribe(value => {
      this.showLoader = value;
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.notificationService.listenForMessages();
        const existingScript = document.querySelector('script[src="js/main.js"]');
        if (existingScript) {
          existingScript.remove();
        }
        const scriptElement = document.createElement('script');
        scriptElement.src = 'js/main.js';
        scriptElement.async = true;
        document.body.appendChild(scriptElement);
      }
    });
  }
}

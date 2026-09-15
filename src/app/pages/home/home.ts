import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  menuAberto = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  @HostListener('document:click', ['$event'])
  @HostListener('document:focusin', ['$event'])
  fecharAoSairDoFoco(event: Event): void {
    if (this.menuAberto && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.menuAberto = false;
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }
}

import { Component, signal, Signal } from '@angular/core';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LogoComponent } from '@shared/logo';
import { AuthService, ThemeService } from '@core/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, LogoComponent, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly isAuthenticated$: Observable<boolean>;
  protected readonly isDark$: Observable<boolean>;
  private readonly _isMenuOpen$ = new BehaviorSubject<boolean>(false);
  protected readonly isMenuOpen$ = this._isMenuOpen$.asObservable();

  protected readonly routes = [
    {
      label: 'Books',
      icon: 'LibraryBig',
      path: '/books',
    },
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService,
    private readonly router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isDark$ = this.themeService.isDark$;
  }

  protected toggleMenu(): void {
    this._isMenuOpen$.next(!this._isMenuOpen$.value);
  }

  protected closeMenu(): void {
    this._isMenuOpen$.next(false);
  }

  /** Closes the dropdown only when it is open (mobile view). No-op when nav is always visible. */
  protected closeMenuIfOpen(): void {
    if (this._isMenuOpen$.value) {
      this.closeMenu();
    }
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected handleLogout(): void {
    const response = this.authService.logout();
    if (response.success) {
      this.router.navigate(['/']);
    }
  }
}

import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly renderer: Renderer2;
  private readonly THEME_KEY = 'shelfy-is-dark-theme';

  private readonly _isDark$ = new BehaviorSubject<boolean>(this.getInitialTheme());
  public readonly isDark$ = this._isDark$.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this._isDark$.subscribe((isDark) => {
      this.applyTheme(isDark);
      this.saveToStorage(isDark);
    });

    // const isDark = this._isDark$.value;

    // if (isDark) {
    //   this.renderer.addClass(document.documentElement, 'dark');
    // } else {
    //   this.renderer.removeClass(document.documentElement, 'dark');
    // }

    // localStorage.setItem(this.THEME_KEY, JSON.stringify(isDark));
  }

  toggleTheme(): void {
    this._isDark$.next(!this._isDark$.value);
  }

  setDarkTheme(isDark: boolean): void {
    this._isDark$.next(isDark);
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  private saveToStorage(isDark: boolean): void {
    localStorage.setItem(this.THEME_KEY, JSON.stringify(isDark));
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem(this.THEME_KEY);

    if (savedTheme !== null) {
      try {
        const parsedTheme = JSON.parse(savedTheme);

        if (typeof parsedTheme === 'boolean') return parsedTheme;
      } catch {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}

import { Injectable, signal, effect, RendererFactory2, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly renderer: Renderer2;
  private readonly THEME_KEY = 'shelfy-is-dark-theme';

  private readonly _isDark = signal<boolean>(this.getInitialTheme());
  public readonly isDark = this._isDark.asReadonly();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    effect(() => {
      const isDark = this._isDark();

      if (isDark) {
        this.renderer.addClass(document.documentElement, 'dark');
      } else {
        this.renderer.removeClass(document.documentElement, 'dark');
      }

      localStorage.setItem(this.THEME_KEY, JSON.stringify(isDark));
    });
  }

  toggleTheme(): void {
    this._isDark.update((isDark) => !isDark);
  }

  setDarkTheme(isDark: boolean): void {
    this._isDark.set(isDark);
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

import { Injectable, signal, effect, RendererFactory2, Renderer2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly renderer: Renderer2;
  private readonly blockedCount = signal(0);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    effect(() => {
      if (this.blockedCount() > 0) {
        this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
      } else {
        this.renderer.removeStyle(document.documentElement, 'overflow');
      }
    });
  }

  lock() {
    this.blockedCount.update((count) => count + 1);
  }

  unlock() {
    this.blockedCount.update((count) => Math.max(0, count - 1));
  }
}

import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly renderer: Renderer2;
  private readonly _blockedCount$ = new BehaviorSubject<number>(0);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this._blockedCount$.subscribe((count) => {
      if (count > 0) {
        this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
      } else {
        this.renderer.removeStyle(document.documentElement, 'overflow');
      }
    });
  }

  lock() {
    this._blockedCount$.next(this._blockedCount$.value + 1);
  }

  unlock() {
    this._blockedCount$.next(Math.max(0, this._blockedCount$.value - 1));
  }
}

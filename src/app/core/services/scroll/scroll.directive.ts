import { Directive, OnInit, OnDestroy } from '@angular/core';
import { ScrollService } from './scroll.service';

@Directive({
  selector: '[appScrollLock]',
})
export class ScrollLockDirective implements OnInit, OnDestroy {
  constructor(private readonly scrollService: ScrollService) {}

  ngOnInit() {
    this.scrollService.lock();
  }

  ngOnDestroy() {
    this.scrollService.unlock();
  }
}

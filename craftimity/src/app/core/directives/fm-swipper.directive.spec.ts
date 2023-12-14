import { ElementRef } from '@angular/core';
import { SwipperDirective } from './fm-swipper.directive';

describe('FmSwipperDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef<HTMLElement>(new HTMLElement());
    const directive = new SwipperDirective(el);
    expect(directive).toBeTruthy();
  });
});

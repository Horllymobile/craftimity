import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WishlistsPage } from './wishlists.page';

describe('WishlistsPage', () => {
  let component: WishlistsPage;
  let fixture: ComponentFixture<WishlistsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WishlistsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

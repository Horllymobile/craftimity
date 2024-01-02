import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnboardingCraftsmanComponent } from './onboarding-craftsman.component';

describe('OnboardingCraftsmanComponent', () => {
  let component: OnboardingCraftsmanComponent;
  let fixture: ComponentFixture<OnboardingCraftsmanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingCraftsmanComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingCraftsmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureStreamComponent } from './secure-stream.component';

describe('SecureStreamComponent', () => {
  let component: SecureStreamComponent;
  let fixture: ComponentFixture<SecureStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecureStreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecureStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

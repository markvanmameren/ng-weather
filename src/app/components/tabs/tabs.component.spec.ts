/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';

@Component({
  standalone: true,
  template: ''
})
class TestComponent {}

describe('TabsComponent', () => {
  let component: TabsComponent<typeof TestComponent>;
  let fixture: ComponentFixture<TabsComponent<typeof TestComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent<typeof TestComponent>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgComponentOutlet } from '@angular/common';
import { Component, computed, input, Signal, signal, Type } from '@angular/core';
import { Tab, Tabs } from '../../types/tab.type';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent<T extends Type<unknown>> {
  tabs = input.required<Tabs<T>>();

  activeTabId = signal<string | null>(null);
  activeTab: Signal<Tab<T> | undefined> = computed(() => this.tabs().tabs.find(({ id }) => id === this.activeTabId()));

  activateTab(tabIdToOpen: string): void {
    this.activeTabId.set(tabIdToOpen);
  }

  deactivateTab(): void {
    this.activeTabId.set(null);
  }

  closeTab(tabIdToClose: string): void {
    if (this.activeTabId() === tabIdToClose) this.deactivateTab();

    const tabToClose = this.tabs().tabs.find(({ id }) => id === tabIdToClose);
    if (!tabToClose) return;

    tabToClose.onClose();
  }
}

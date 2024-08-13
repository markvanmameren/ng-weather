import { Type } from '@angular/core';

export interface Tabs<T extends Type<unknown>> {
  componentType: T;
  tabs: Tab<T>[];
}

export interface Tab<T extends Type<unknown>> {
  id: string;
  title: string;
  componentInputs: Partial<Record<keyof InstanceType<T>, unknown>>;
  onClose: () => void;
}

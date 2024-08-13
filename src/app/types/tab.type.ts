import { Type } from '@angular/core';

type AngularComponent = Type<unknown>;

export interface Tabs<T extends AngularComponent> {
  componentType: T;
  tabs: Tab<T>[];
}

export interface Tab<T extends AngularComponent> {
  id: string;
  title: string;
  componentInputs: Partial<Record<keyof InstanceType<T>, unknown>>;
  onClose: () => void;
}

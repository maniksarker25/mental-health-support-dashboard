import React from 'react';
import * as Lucide from 'lucide-react';
import type { LucideProps } from 'lucide-react';

type IconMap = Record<string, React.ComponentType<LucideProps>>;

export function DynamicIcon({ name, ...props }: {name: string;} & LucideProps) {
  const map = Lucide as unknown as IconMap;
  const Icon = map[name] ?? map[`${name}Icon`] ?? Lucide.CircleIcon;
  return <Icon {...props} />;
}
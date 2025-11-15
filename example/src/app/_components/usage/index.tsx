import * as Tabs from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';
import { UsageTabTrigger } from './tab-trigger';

interface UsageProps {
  tab: 'browser' | 'node';
  children: [ReactNode, ReactNode];
}

export const Usage = ({ tab, children }: UsageProps) => {
  const [browserContent, nodeContent] = children;

  return (
    <Tabs.Root value={tab}>
      <Tabs.List className="flex gap-2 border-neutral-200 border-b pb-2">
        <UsageTabTrigger value="browser">Browser</UsageTabTrigger>
        <UsageTabTrigger value="node">Node.js</UsageTabTrigger>
      </Tabs.List>

      <Tabs.Content value="browser" className="mt-6">
        {browserContent}
      </Tabs.Content>
      <Tabs.Content value="node" className="mt-6">
        {nodeContent}
      </Tabs.Content>
    </Tabs.Root>
  );
};

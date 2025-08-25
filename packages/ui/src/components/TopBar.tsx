import { useRouter } from '@tanstack/react-router';
import { FC, ReactNode, useState } from 'react';

import LogoComponent from '../resources/logotype.svg?react';
import { cn } from '../utils';
import { ThemeController } from './ThemeController';

type TopBarProps = {
  children?: ReactNode;
  className?: string;
};

export const TopBar: FC<TopBarProps> = ({ children, className = '' }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const submit = () => {
    const q = query.trim();
    if (q.length === 0) {
      return;
    }
    router.navigate({ to: '/search', search: { q } });
  };

  return (
    <header
      className={cn(
        'bg-background border-border flex h-12 items-center border-b-2 px-4',
        className,
      )}
    >
      <LogoComponent className="inline-flex h-6 w-6" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submit();
          }
        }}
        placeholder="Search"
        className="bg-background border-border ml-4 w-80 rounded border-2 px-3 py-1 outline-none"
      />
      {children}
      <div className="flex-1" />
      <ThemeController />
    </header>
  );
};

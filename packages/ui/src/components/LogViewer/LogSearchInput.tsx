import { Search } from 'lucide-react';
import { FC } from 'react';

import { Input } from '../Input';

export type LogSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
};

export const LogSearchInput: FC<LogSearchInputProps> = ({
  value,
  onChange,
  isValid,
}) => (
  <div className="min-w-48 flex-1">
    <Input
      aria-label="Search logs"
      placeholder="Search logs..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      state={isValid ? 'normal' : 'error'}
      endAddon={<Search className="size-4" />}
    />
  </div>
);

import { Moon, Sun } from 'lucide-react';
import { FC, useEffect } from 'react';

import { Toggle } from '../Toggle/Toggle';

type ThemeControllerProps = {
  isDark?: boolean;
  defaultIsDark?: boolean;
  onThemeChange?: (isDark: boolean) => void;
  disabled?: boolean;
  className?: string;
};

const ICON_SIZE = 12;

export const ThemeController: FC<ThemeControllerProps> = ({
  isDark,
  defaultIsDark = false,
  onThemeChange,
  disabled,
  className,
}) => {
  const handleThemeChange = (newIsDark: boolean) => {
    if (newIsDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    onThemeChange?.(newIsDark);
  };

  useEffect(() => {
    if (isDark !== undefined) {
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }, [isDark]);

  return (
    <Toggle
      checked={isDark}
      defaultChecked={defaultIsDark}
      onChange={handleThemeChange}
      disabled={disabled}
      className={className}
      label="Toggle theme"
      thumbIcon={<Sun size={ICON_SIZE} className="text-foreground" />}
      checkedThumbIcon={<Moon size={ICON_SIZE} className="text-foreground" />}
    />
  );
};

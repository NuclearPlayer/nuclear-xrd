import { useEffect, useMemo, useRef, useState } from 'react';

import type { SettingsHost, SettingValue } from '../types/settings';

export const useSetting = <T extends SettingValue = SettingValue>(
  host: SettingsHost | undefined,
  id: string,
) => {
  const hostRef = useRef(host);
  hostRef.current = host;

  const [currentValue, setCurrentValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (!hostRef.current) return;
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    hostRef.current.get<T>(id).then((initialValue) => {
      if (!isMounted) return;
      setCurrentValue(initialValue);
      unsubscribe = hostRef.current?.subscribe<T>(id, (nextValue) =>
        setCurrentValue(nextValue),
      );
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [id, hostRef]);

  const setValue = useMemo(
    () => (nextValue: T) => {
      if (!hostRef.current) return;
      void hostRef.current.set<T>(id, nextValue);
    },
    [id],
  );

  return [currentValue, setValue] as const;
};

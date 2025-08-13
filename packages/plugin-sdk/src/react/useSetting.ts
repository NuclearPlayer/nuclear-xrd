import { useEffect, useMemo, useRef, useState } from 'react';

import type { SettingsHost, SettingValue } from '../types/settings';

export const useSetting = <T extends SettingValue = SettingValue>(
  host: SettingsHost | undefined,
  id: string,
) => {
  const hostRef = useRef(host);
  hostRef.current = host;

  const [value, setValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (!hostRef.current) return;
    let unsub: (() => void) | undefined;
    let mounted = true;

    hostRef.current.get<T>(id).then((initial) => {
      if (!mounted) return;
      setValue(initial);
      unsub = hostRef.current?.subscribe<T>(id, (v) => setValue(v));
    });

    return () => {
      mounted = false;
      if (unsub) unsub();
    };
  }, [id, hostRef]);

  const set = useMemo(
    () => (next: T) => {
      if (!hostRef.current) return;
      void hostRef.current.set<T>(id, next);
    },
    [id],
  );

  return [value, set] as const;
};

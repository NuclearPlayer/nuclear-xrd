import { CellContext } from '@tanstack/react-table';

import { Track } from '@nuclearplayer/model';

export const TextCell = <T extends Track>({
  getValue,
}: CellContext<T, string | number | undefined>) => (
  <div className="truncate p-2">{getValue()}</div>
);

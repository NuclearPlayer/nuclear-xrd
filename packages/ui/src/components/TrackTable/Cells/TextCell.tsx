import { CellContext } from '@tanstack/react-table';

import { Track } from '@nuclearplayer/model';

export const TextCell = <T extends Track>({
  getValue,
}: CellContext<T, string | number | undefined>) => (
  <td className="px-2">
    <div className="truncate">{getValue()}</div>
  </td>
);

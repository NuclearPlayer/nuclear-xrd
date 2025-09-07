import { LucideProps } from 'lucide-react';
import { FC } from 'react';

export const IconHeader = ({ Icon }: { Icon: FC<LucideProps> }) => {
  return (
    <th role="columnheader" className="text-center">
      <div className="flex w-full items-center justify-center">
        <Icon className="h-6 w-6" absoluteStrokeWidth />
      </div>
    </th>
  );
};

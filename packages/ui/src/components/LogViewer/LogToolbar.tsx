import { FolderOpen, Loader2, Trash2, Upload } from 'lucide-react';
import { FC, useState } from 'react';

import { Button } from '../Button';

export type LogToolbarProps = {
  onClear: () => void;
  onExport: () => void | Promise<void>;
  onOpenLogFolder: () => void;
};

export const LogToolbar: FC<LogToolbarProps> = ({
  onClear,
  onExport,
  onOpenLogFolder,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } catch {
      // Error handling is the caller's responsibility
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="noShadow" size="sm" onClick={onClear}>
        <Trash2 className="mr-1 size-4" />
        Clear
      </Button>
      <Button
        variant="noShadow"
        size="sm"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="mr-1 size-4 animate-spin" />
        ) : (
          <Upload className="mr-1 size-4" />
        )}
        Export
      </Button>
      <Button variant="noShadow" size="sm" onClick={onOpenLogFolder}>
        <FolderOpen className="mr-1 size-4" />
        Open Log Folder
      </Button>
    </div>
  );
};

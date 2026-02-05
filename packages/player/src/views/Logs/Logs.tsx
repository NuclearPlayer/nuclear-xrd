import { getVersion } from '@tauri-apps/api/app';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { useCallback } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { LogEntryData, LogViewer, ViewShell } from '@nuclearplayer/ui';

import { useLogStream } from '../../hooks/useLogStream';

const formatLogForExport = (log: LogEntryData): string => {
  const timestamp = log.timestamp.toISOString();
  const level = log.level.toUpperCase().padEnd(5);
  const scope =
    log.source.type === 'plugin'
      ? `plugin:${log.source.scope}`
      : log.source.scope;
  return `[${timestamp}] [${level}] [${scope}] ${log.message}`;
};

const generateExportContent = async (logs: LogEntryData[]): Promise<string> => {
  const appVersion = await getVersion();

  const header = [
    '# Nuclear Music Player - Log Export',
    `# Version: ${appVersion}`,
    `# Platform: ${navigator.platform}`,
    `# Exported: ${new Date().toISOString()}`,
    `# Entries: ${logs.length}`,
    '#',
    '',
  ].join('\n');

  const logLines = logs.map(formatLogForExport).join('\n');
  return header + logLines;
};

export const Logs = () => {
  const { t } = useTranslation('logs');
  const { logs, scopes, clearLogs } = useLogStream();

  const handleExport = useCallback(async () => {
    const filePath = await save({
      defaultPath: `nuclear-logs-${new Date().toISOString().slice(0, 10)}.txt`,
      filters: [{ name: 'Text Files', extensions: ['txt'] }],
    });

    if (!filePath) {
      return;
    }

    const content = await generateExportContent(logs);
    await writeTextFile(filePath, content);
  }, [logs]);

  return (
    <ViewShell title={t('title')}>
      <LogViewer
        logs={logs}
        scopes={scopes}
        onClear={clearLogs}
        onExport={handleExport}
        onOpenLogFolder={() => {}}
      />
    </ViewShell>
  );
};

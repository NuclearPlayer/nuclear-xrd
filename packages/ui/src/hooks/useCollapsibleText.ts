import { useCallback, useMemo, useState } from 'react';

const COLLAPSED_MAX_LINES = 3;
const COLLAPSED_MAX_CHARS = 300;

export type UseCollapsibleTextResult = {
  isCollapsible: boolean;
  displayedText: string;
  isExpanded: boolean;
  toggle: () => void;
};

export const useCollapsibleText = (text: string): UseCollapsibleTextResult => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { isCollapsible, collapsedText } = useMemo(() => {
    const messageLines = text.split('\n');
    const hasManyLines = messageLines.length > COLLAPSED_MAX_LINES;
    const hasManyChars = text.length > COLLAPSED_MAX_CHARS;

    if (!hasManyLines && !hasManyChars) {
      return { isCollapsible: false, collapsedText: text };
    }

    const truncated = hasManyLines
      ? messageLines.slice(0, COLLAPSED_MAX_LINES).join('\n')
      : text.slice(0, COLLAPSED_MAX_CHARS) + '…';

    return { isCollapsible: true, collapsedText: truncated };
  }, [text]);

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const displayedText = isCollapsible && !isExpanded ? collapsedText : text;

  return { isCollapsible, displayedText, isExpanded, toggle };
};

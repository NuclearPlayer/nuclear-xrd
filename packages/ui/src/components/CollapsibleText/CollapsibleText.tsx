import { ChevronDown, ChevronUp } from 'lucide-react';
import { FC, useState } from 'react';

const COLLAPSED_MAX_LINES = 3;
const COLLAPSED_MAX_CHARS = 300;

export type CollapsibleTextProps = {
  text: string;
  className?: string;
};

export const CollapsibleText: FC<CollapsibleTextProps> = ({
  text,
  className,
}) => {
  const messageLines = text.split('\n');
  const hasManyLines = messageLines.length > COLLAPSED_MAX_LINES;
  const hasManyChars = text.length > COLLAPSED_MAX_CHARS;
  const isCollapsible = hasManyLines || hasManyChars;
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedMessage = (() => {
    if (!isCollapsible || isExpanded) {
      return text;
    }
    if (hasManyLines) {
      return messageLines.slice(0, COLLAPSED_MAX_LINES).join('\n');
    }
    return text.slice(0, COLLAPSED_MAX_CHARS) + '…';
  })();

  return (
    <div>
      <span data-testid="log-message" className={className}>
        {displayedMessage}
      </span>
      {isCollapsible && (
        <button
          type="button"
          data-testid="log-expand-toggle"
          className="text-foreground/50 hover:text-foreground/80 mt-1 flex cursor-pointer items-center gap-1 text-xs"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? (
            <>
              Show less
              <ChevronUp className="size-3" />
            </>
          ) : (
            <>
              Show more
              <ChevronDown className="size-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

import { Check, Copy } from 'lucide-react';
import { FC, memo, useEffect, useRef, useState } from 'react';

import { Button } from '../Button';

const COPY_FEEDBACK_DURATION_MS = 2000;

type CopyButtonProps = {
  text: string;
};

const CopyButtonImpl: FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setCopied(false);
    }, COPY_FEEDBACK_DURATION_MS);
  };

  return (
    <Button data-testid="log-copy-button" size="icon-sm" onClick={handleCopy}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </Button>
  );
};

export const CopyButton = memo(CopyButtonImpl);

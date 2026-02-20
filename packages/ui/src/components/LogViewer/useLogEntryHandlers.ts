import { useCallback, useRef } from 'react';

import { useLogViewerContext } from './context';

export const useLogEntryHandlers = () => {
  const {
    scopes,
    selectedLevels,
    setSelectedLevels,
    selectedScopes,
    setSelectedScopes,
  } = useLogViewerContext();

  const selectedLevelsRef = useRef(selectedLevels);
  selectedLevelsRef.current = selectedLevels;

  const selectedScopesRef = useRef(selectedScopes);
  selectedScopesRef.current = selectedScopes;

  const scopesRef = useRef(scopes);
  scopesRef.current = scopes;

  const handleLevelClick = useCallback(
    (level: string) => {
      const current = selectedLevelsRef.current;
      if (current.length === 1 && current[0] === level) {
        setSelectedLevels([]);
      } else {
        setSelectedLevels([level]);
      }
    },
    [setSelectedLevels],
  );

  const handleScopeClick = useCallback(
    (scope: string) => {
      const current = selectedScopesRef.current;
      if (current.length === 1 && current[0] === scope) {
        setSelectedScopes([]);
      } else {
        setSelectedScopes([scope]);
      }
    },
    [setSelectedScopes],
  );

  const isScopeClickable = useCallback(
    (scope: string) => scopesRef.current.includes(scope),
    [],
  );

  return { handleLevelClick, handleScopeClick, isScopeClickable };
};

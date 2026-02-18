import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import type { AttributedResult } from '@nuclearplayer/plugin-sdk';

type EntityType = 'artist' | 'album';

type EntityInfo = {
  name: string;
  sourceId: string;
};

// This hook is needed so we can redirect to artists/albums whether a linked
// metadata provider was declared by a dashboard provider or not. If it was, we
// go directly to the entity page by id. If not, we can at least offer a
// prefilled search for the entity name.
export const useNavigateToEntity = () => {
  const navigate = useNavigate();

  return useCallback(
    <T>(
      entity: EntityInfo,
      result: AttributedResult<T>,
      entityType: EntityType,
    ) => {
      if (result.metadataProviderId) {
        navigate({
          to: `/${entityType}/${result.metadataProviderId}/${entity.sourceId}`,
        });
      } else {
        navigate({
          to: '/search',
          search: { q: entity.name },
        });
      }
    },
    [navigate],
  );
};

import type { Artwork, ArtworkPurpose, ArtworkSet } from './index';

export function pickArtwork(
  set: ArtworkSet | undefined,
  purpose: ArtworkPurpose,
  targetPx: number,
): Artwork | undefined {
  if (!set?.items?.length) {
    return undefined;
  }

  const candidates = set.items.filter((item) => {
    if (item.purpose && item.purpose !== purpose) {
      return false;
    }
    if (!item.url) {
      return false;
    }
    return true;
  });

  if (!candidates.length) {
    return set.items[0];
  }

  const getAspectRatio = (artwork: Artwork): number => {
    if (!artwork.width || !artwork.height) {
      return 1;
    }
    return artwork.width / artwork.height;
  };

  const getTargetAspectRatio = (p: ArtworkPurpose): number => {
    switch (p) {
      case 'avatar':
      case 'thumbnail':
        return 1;
      case 'cover':
        return 1;
      case 'background':
        return 16 / 9;
      default:
        return 1;
    }
  };

  const targetAspect = getTargetAspectRatio(purpose);

  return candidates
    .map((artwork) => {
      const size = Math.min(artwork.width || 0, artwork.height || 0);
      const aspectDiff = Math.abs(getAspectRatio(artwork) - targetAspect);
      const sizeDiff = Math.abs(size - targetPx);
      const upscaleFactor = size < targetPx ? targetPx / size : 1;

      return {
        artwork,
        score:
          (upscaleFactor > 1.5 ? -1000 : 0) +
          -aspectDiff * 50 +
          -sizeDiff * 0.1,
      };
    })
    .sort((a, b) => b.score - a.score)[0]?.artwork;
}

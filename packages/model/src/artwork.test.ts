import { ArtworkSet, pickArtwork } from '.';

describe('Artwork helpers', () => {
  it('should pick nothing when the set is empty', () => {
    const set: ArtworkSet = {
      items: [],
    };

    const artwork = pickArtwork(set, 'avatar', 100);
    expect(artwork).toBeUndefined();
  });

  it('should prefer items with matching purpose', () => {
    const set: ArtworkSet = {
      items: [
        { url: 'a', width: 256, height: 256, purpose: 'cover' },
        { url: 'b', width: 256, height: 256, purpose: 'avatar' },
        { url: 'c', width: 256, height: 256, purpose: 'thumbnail' },
      ],
    };

    const artwork = pickArtwork(set, 'avatar', 256);
    expect(artwork?.url).toBe('b');
  });

  it('should pick the size closest to target for square purposes', () => {
    const set: ArtworkSet = {
      items: [
        { url: 's-100', width: 100, height: 100, purpose: 'avatar' },
        { url: 's-200', width: 200, height: 200, purpose: 'avatar' },
        { url: 's-300', width: 300, height: 300, purpose: 'avatar' },
      ],
    };

    const artwork = pickArtwork(set, 'avatar', 220);
    expect(artwork?.url).toBe('s-200');
  });

  it('should favor 16:9 for background purpose over square', () => {
    const set: ArtworkSet = {
      items: [
        { url: 'square', width: 256, height: 256, purpose: 'background' },
        { url: 'widescreen', width: 320, height: 180, purpose: 'background' },
      ],
    };

    const artwork = pickArtwork(set, 'background', 256);
    expect(artwork?.url).toBe('widescreen');
  });

  it('should fall back to the first item when no candidates match', () => {
    const set: ArtworkSet = {
      items: [
        { url: 'first', width: 256, height: 256, purpose: 'cover' },
        { url: 'second', width: 256, height: 256, purpose: 'cover' },
      ],
    };

    const artwork = pickArtwork(set, 'background', 256);
    expect(artwork?.url).toBe('first');
  });

  it('should ignore items without a usable url when selecting candidates', () => {
    const set: ArtworkSet = {
      items: [
        { url: '', width: 195, height: 195, purpose: 'avatar' },
        { url: 'valid', width: 200, height: 200, purpose: 'avatar' },
      ],
    };

    const artwork = pickArtwork(set, 'avatar', 190);
    expect(artwork?.url).toBe('valid');
  });

  it('should consider items without purpose as candidates and pick by aspect/size', () => {
    const set: ArtworkSet = {
      items: [
        { url: 'no-purpose-square-220', width: 220, height: 220 },
        { url: 'no-purpose-rect', width: 320, height: 180 },
      ],
    };

    const artwork = pickArtwork(set, 'avatar', 200);
    expect(artwork?.url).toBe('no-purpose-square-220');
  });
});

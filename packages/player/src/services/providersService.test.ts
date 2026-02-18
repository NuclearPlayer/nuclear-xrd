import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type {
  ProviderDescriptor,
  ProviderKind,
} from '@nuclearplayer/plugin-sdk';

import { providersHost } from './providersHost';

const createProvider = <K extends ProviderKind>(
  id: string,
  kind: K,
  name: string,
) => ({ id, kind, name }) as ProviderDescriptor<K>;

beforeEach(() => {
  providersHost.clear();
});

afterEach(() => {
  providersHost.clear();
});
describe('Providers service', () => {
  it('register returns id and re-register replaces implementation', () => {
    const p1 = createProvider('test-prov-1', 'metadata', 'One');
    expect(providersHost.register(p1)).toBe('test-prov-1');
    expect(providersHost.get('test-prov-1', 'metadata')?.name).toBe('One');

    const p1b = createProvider('test-prov-1', 'metadata', 'Two');
    expect(providersHost.register(p1b)).toBe('test-prov-1');
    expect(providersHost.get('test-prov-1', 'metadata')?.name).toBe('Two');

    const listMeta = providersHost.list('metadata');
    expect(listMeta).toMatchInlineSnapshot(`
      [
        {
          "id": "test-prov-1",
          "kind": "metadata",
          "name": "Two",
        },
      ]
    `);
  });

  it('list by kind and list all', () => {
    const pMeta = createProvider('test-prov-2', 'metadata', 'Meta');
    const pLyrics = createProvider('test-prov-3', 'lyrics', 'Lyrics');

    providersHost.register(pMeta);
    providersHost.register(pLyrics);

    const listMeta = providersHost.list('metadata');
    const listLyrics = providersHost.list('lyrics');
    const listAll = providersHost.list();

    expect(listMeta).toMatchInlineSnapshot(`
      [
        {
          "id": "test-prov-2",
          "kind": "metadata",
          "name": "Meta",
        },
      ]
    `);
    expect(listLyrics).toMatchInlineSnapshot(`
      [
        {
          "id": "test-prov-3",
          "kind": "lyrics",
          "name": "Lyrics",
        },
      ]
    `);
    expect(listAll).toMatchInlineSnapshot(`
      [
        {
          "id": "test-prov-2",
          "kind": "metadata",
          "name": "Meta",
        },
        {
          "id": "test-prov-3",
          "kind": "lyrics",
          "name": "Lyrics",
        },
      ]
    `);
  });

  it('get by id returns descriptor', () => {
    const p = createProvider('test-prov-4', 'metadata', 'Getter');
    providersHost.register(p);
    expect(providersHost.get('test-prov-4', 'metadata')).toMatchInlineSnapshot(`
      {
        "id": "test-prov-4",
        "kind": "metadata",
        "name": "Getter",
      }
    `);
  });

  it('unregister removes from byId and byKind', () => {
    const p = createProvider('test-prov-5', 'metadata', 'ToRemove');
    providersHost.register(p);

    expect(providersHost.unregister('test-prov-5')).toBe(true);
    expect(providersHost.get('test-prov-5', 'metadata')).toBeUndefined();

    expect(providersHost.list('metadata').length).toBe(0);
  });

  it('unregister returns false for non-existent id', () => {
    expect(providersHost.unregister('missing-id')).toBe(false);
  });

  it('get returns undefined when kind does not match', () => {
    const provider = createProvider('test-prov-6', 'metadata', 'WrongKind');
    providersHost.register(provider);

    expect(providersHost.get('test-prov-6', 'streaming')).toBeUndefined();
  });
});

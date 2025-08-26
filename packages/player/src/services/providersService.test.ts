import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type {
  ProviderDescriptor,
  ProviderKind,
} from '@nuclearplayer/plugin-sdk';

import { providersServiceHost } from './providersService';

const createProvider = <K extends ProviderKind>(
  id: string,
  kind: K,
  name: string,
) => ({ id, kind, name }) as ProviderDescriptor<K>;

beforeEach(() => {
  providersServiceHost.clear();
});

afterEach(() => {
  providersServiceHost.clear();
});

describe('Providers service', () => {
  it('register returns id and re-register replaces implementation', () => {
    const p1 = createProvider('test-prov-1', 'metadata', 'One');
    expect(providersServiceHost.register(p1)).toBe('test-prov-1');
    expect(providersServiceHost.get('test-prov-1')?.name).toBe('One');

    const p1b = createProvider('test-prov-1', 'metadata', 'Two');
    expect(providersServiceHost.register(p1b)).toBe('test-prov-1');
    expect(providersServiceHost.get('test-prov-1')?.name).toBe('Two');

    const listMeta = providersServiceHost.list('metadata');
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

    providersServiceHost.register(pMeta);
    providersServiceHost.register(pLyrics);

    const listMeta = providersServiceHost.list('metadata');
    const listLyrics = providersServiceHost.list('lyrics');
    const listAll = providersServiceHost.list();

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
    providersServiceHost.register(p);
    expect(providersServiceHost.get('test-prov-4')).toMatchInlineSnapshot(`
      {
        "id": "test-prov-4",
        "kind": "metadata",
        "name": "Getter",
      }
    `);
  });

  it('unregister removes from byId and byKind', () => {
    const p = createProvider('test-prov-5', 'metadata', 'ToRemove');
    providersServiceHost.register(p);

    expect(providersServiceHost.unregister('test-prov-5')).toBe(true);
    expect(providersServiceHost.get('test-prov-5')).toBeUndefined();

    expect(providersServiceHost.list('metadata').length).toBe(0);
  });

  it('unregister returns false for non-existent id', () => {
    expect(providersServiceHost.unregister('missing-id')).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';

import { RingBuffer } from './RingBuffer';

describe('RingBuffer', () => {
  it('stores items up to capacity', () => {
    const buffer = new RingBuffer<number>(3);

    buffer.push(1);
    buffer.push(2);
    buffer.push(3);

    expect(buffer.toArray()).toEqual([1, 2, 3]);
  });

  it('overwrites oldest items when capacity exceeded', () => {
    const buffer = new RingBuffer<number>(3);

    buffer.push(1);
    buffer.push(2);
    buffer.push(3);
    buffer.push(4);
    buffer.push(5);

    expect(buffer.toArray()).toEqual([3, 4, 5]);
  });

  it('maintains correct order after wrapping', () => {
    const buffer = new RingBuffer<number>(3);

    for (let i = 1; i <= 10; i++) {
      buffer.push(i);
    }

    expect(buffer.toArray()).toEqual([8, 9, 10]);
  });

  it('clears all items', () => {
    const buffer = new RingBuffer<number>(3);

    buffer.push(1);
    buffer.push(2);
    buffer.clear();

    expect(buffer.toArray()).toEqual([]);
  });

  it('works correctly after clear and refill', () => {
    const buffer = new RingBuffer<number>(3);

    buffer.push(1);
    buffer.push(2);
    buffer.clear();
    buffer.push(10);
    buffer.push(20);

    expect(buffer.toArray()).toEqual([10, 20]);
  });

  it('prepends items to the front', () => {
    const buffer = new RingBuffer<number>(5);

    buffer.push(3);
    buffer.push(4);
    buffer.prepend([1, 2]);

    expect(buffer.toArray()).toEqual([1, 2, 3, 4]);
  });

  it('prepend respects capacity limit', () => {
    const buffer = new RingBuffer<number>(3);

    buffer.push(4);
    buffer.push(5);
    buffer.prepend([1, 2, 3]);

    expect(buffer.toArray()).toEqual([3, 4, 5]);
  });

  it('handles empty prepend', () => {
    const buffer = new RingBuffer<number>(3);

    buffer.push(1);
    buffer.prepend([]);

    expect(buffer.toArray()).toEqual([1]);
  });

  it('handles prepend to empty buffer', () => {
    const buffer = new RingBuffer<number>(3);

    buffer.prepend([1, 2]);

    expect(buffer.toArray()).toEqual([1, 2]);
  });
});

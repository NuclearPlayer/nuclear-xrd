export class RingBuffer<T> {
  private buffer: T[] = [];
  private head = 0;
  private count = 0;

  constructor(private readonly capacity: number) {}

  push(item: T): void {
    if (this.count < this.capacity) {
      this.buffer.push(item);
      this.count++;
    } else {
      this.buffer[this.head] = item;
      this.head = (this.head + 1) % this.capacity;
    }
  }

  clear(): void {
    this.buffer = [];
    this.head = 0;
    this.count = 0;
  }

  toArray(): T[] {
    if (this.count < this.capacity) {
      return [...this.buffer];
    }
    return [
      ...this.buffer.slice(this.head),
      ...this.buffer.slice(0, this.head),
    ];
  }

  prepend(items: T[]): void {
    const current = this.toArray();
    this.clear();
    const combined = [...items, ...current];
    const toKeep = combined.slice(-this.capacity);
    for (const item of toKeep) {
      this.push(item);
    }
  }
}

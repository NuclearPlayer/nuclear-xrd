class MockUuid {
  #counter = 0;

  v4 = (): string => `mock-uuid-${this.#counter++}`;

  reset(): void {
    this.#counter = 0;
  }
}

export const mockUuid = new MockUuid();

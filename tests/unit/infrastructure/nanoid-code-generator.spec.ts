import { describe, expect, it } from 'vitest';
import { NanoidCodeGenerator } from '../../../src/infrastructure/generator/nanoid-code-generator.js';

describe('NanoidCodeGenerator', () => {
  const generator = new NanoidCodeGenerator();

  it('should generate short code with default length of 7', () => {
    const code = generator.generateCode();
    expect(code).toBeDefined();
    expect(code.length).toBe(7);
  });

  it('should generate short code with custom length', () => {
    const code = generator.generateCode(10);
    expect(code.length).toBe(10);
  });

  it('should generate unique codes', () => {
    const code1 = generator.generateCode();
    const code2 = generator.generateCode();
    expect(code1).not.toBe(code2);
  });

  it('should generate unique IDs', () => {
    const id1 = generator.generateId();
    const id2 = generator.generateId();
    expect(id1).toBeDefined();
    expect(id1).not.toBe(id2);
  });
});

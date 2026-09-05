import { customAlphabet, nanoid } from 'nanoid';
import { ICodeGenerator } from '../../application/ports/code-generator.interface.js';

const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_CODE_LENGTH = 7;

export class NanoidCodeGenerator implements ICodeGenerator {
  private readonly codeGenerator: (size?: number) => string;

  constructor(alphabet: string = BASE62_ALPHABET) {
    this.codeGenerator = customAlphabet(alphabet, DEFAULT_CODE_LENGTH);
  }

  generateCode(length: number = DEFAULT_CODE_LENGTH): string {
    return this.codeGenerator(length);
  }

  generateId(): string {
    return nanoid(21);
  }
}

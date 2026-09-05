export interface ICodeGenerator {
  generateCode(length?: number): string;
  generateId(): string;
}

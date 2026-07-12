import type { ParseError } from './interfaces.ts';

export class ParserException extends Error {
  readonly detail: ParseError;

  constructor(detail: ParseError) {
    super(detail.message);
    this.name = 'ParserException';
    this.detail = detail;
  }
}

export function parseError(
  path: string,
  code: ParseError['code'],
  message: string,
): ParserException {
  return new ParserException({ path, code, message });
}

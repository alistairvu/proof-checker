// Define the types for tokens
export enum TokenType {
  LeftParen = "LeftParen",
  RightParen = "RightParen",
  Or = "Or",
  And = "And",
  Imply = "Imply",
  Not = "Not",
  Atom = "Atom",
  Falsum = "Falsum",
  EOF = "EOF",
}

export interface Token {
  type: TokenType;
  value?: string;
}

export class Tokenizer {
  private input: string;
  private position = 0;
  private currentChar: string | undefined = undefined;

  constructor(input: string) {
    this.input = input;
    this.advance();
  }

  private advance() {
    if (this.position < this.input.length) {
      this.currentChar = this.input[this.position];
      this.position += 1;
    } else {
      this.currentChar = undefined;
    }
  }

  private peek(): string | undefined {
    if (this.position < this.input.length) {
      return this.input[this.position];
    }
    return undefined;
  }

  public getTokens(): Token[] {
    const tokens: Token[] = [];
    while (this.currentChar !== undefined) {
      if (/\s/.test(this.currentChar)) {
        this.advance();
        continue;
      }

      if (this.currentChar === "(") {
        tokens.push({ type: TokenType.LeftParen });
        this.advance();
        continue;
      }

      if (this.currentChar === ")") {
        tokens.push({ type: TokenType.RightParen });
        this.advance();
        continue;
      }

      if (this.currentChar === "∨" || this.currentChar === "|") {
        tokens.push({ type: TokenType.Or });
        this.advance();
        continue;
      }

      if (this.currentChar === "∧" || this.currentChar === "&") {
        tokens.push({ type: TokenType.And });
        this.advance();
        continue;
      }

      if (this.currentChar === "¬" || this.currentChar === "~") {
        tokens.push({ type: TokenType.Not });
        this.advance();
        continue;
      }

      if (this.currentChar === "→") {
        tokens.push({ type: TokenType.Imply });
        this.advance();
        continue;
      }

      if (this.currentChar === "-") {
        const startPos = this.position - 1;
        const substr = this.input.substring(startPos, startPos + 2); // XX has length 2
        if (substr === "->") {
          tokens.push({ type: TokenType.Imply });
          for (let i = 0; i < 2; i++) this.advance();
          continue;
        } else {
          throw new Error(`Unknown token starting at position ${startPos}`);
        }
      }

      if (this.currentChar === "⊥") {
        tokens.push({ type: TokenType.Falsum });
        this.advance();
        continue;
      }

      if (this.currentChar === "\\") {
        const startPos = this.position - 1;
        const substr = this.input.substring(startPos, startPos + 4); // \bot has length 4
        if (substr === "\\bot") {
          tokens.push({ type: TokenType.Falsum });
          for (let i = 0; i < 4; i++) this.advance();
          continue;
        } else {
          throw new Error(`Unknown token starting at position ${startPos}`);
        }
      }

      if (this.currentChar === "X") {
        const startPos = this.position - 1;
        const substr = this.input.substring(startPos, startPos + 2); // XX has length 2
        if (substr === "XX") {
          tokens.push({ type: TokenType.Falsum });
          for (let i = 0; i < 2; i++) this.advance();
          continue;
        } else {
          throw new Error(`Unknown token starting at position ${startPos}`);
        }
      }

      if (/[A-Za-z]/.test(this.currentChar)) {
        tokens.push({ type: TokenType.Atom, value: this.currentChar });
        this.advance();
        continue;
      }

      throw new Error(`Unknown character: ${this.currentChar}`);
    }

    tokens.push({ type: TokenType.EOF });
    return tokens;
  }
}

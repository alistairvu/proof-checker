import {
  type Formula,
  Atom,
  Disjunction,
  Conjunction,
  Falsum,
  Implication,
  Negation,
} from "./formula";
import { type Token, Tokenizer, TokenType } from "./tokenizer";

// Parser class
export class Parser {
  private tokens: Token[];
  private position = 0;
  private currentToken: Token | undefined;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.currentToken = this.tokens[this.position];
  }

  private eat(tokenType: TokenType) {
    if (this.currentToken === undefined) {
      throw new Error(
        `Unexpected token: expected ${tokenType}, got [undefined]`,
      );
    }

    if (this.currentToken.type === tokenType) {
      this.position += 1;
      this.currentToken = this.tokens[this.position];
    } else {
      throw new Error(
        `Unexpected token: expected ${tokenType}, got ${this.currentToken.type}`,
      );
    }
  }

  public parse(): Formula {
    if (this.currentToken === undefined) {
      throw new Error("Current token is undefined");
    }

    const formula = this.parseFormula();
    if (this.currentToken.type !== TokenType.EOF) {
      throw new Error("Unexpected tokens after parsing complete formula");
    }
    return formula;
  }

  // <Formula> := <Disjunction> | <Conjunction> | <Implication> | <Negation> | <Atom> | <Falsum>
  private parseFormula(): Formula {
    if (this.currentToken === undefined) {
      throw new Error("Current token is undefined");
    }

    switch (this.currentToken.type) {
      case TokenType.LeftParen:
        // Could be Disjunction, Conjunction, or Implication
        return this.parseBinaryOperation();
      case TokenType.Not:
        return this.parseNegation();
      case TokenType.Atom:
        return this.parseAtom();
      case TokenType.Falsum:
        return this.parseFalsum();
      default:
        throw new Error(
          `Unexpected token in formula: ${this.currentToken.type}`,
        );
    }
  }

  private parseBinaryOperation(): Formula {
    if (this.currentToken === undefined) {
      throw new Error("Current token is undefined");
    }

    this.eat(TokenType.LeftParen);
    const left = this.parseFormula();

    let operator: TokenType;
    switch (this.currentToken.type) {
      case TokenType.Or:
        operator = TokenType.Or;
        this.eat(TokenType.Or);
        break;
      case TokenType.And:
        operator = TokenType.And;
        this.eat(TokenType.And);
        break;
      case TokenType.Imply:
        operator = TokenType.Imply;
        this.eat(TokenType.Imply);
        break;
      default:
        throw new Error(
          `Expected binary operator, got ${this.currentToken.type}`,
        );
    }

    const right = this.parseFormula();
    this.eat(TokenType.RightParen);

    switch (operator) {
      case TokenType.Or:
        return new Disjunction(left, right);
      case TokenType.And:
        return new Conjunction(left, right);
      case TokenType.Imply:
        return new Implication(left, right);
    }
  }

  private parseNegation(): Formula {
    this.eat(TokenType.Not);
    const formula = this.parseFormula();
    return new Negation(formula);
  }

  private parseAtom(): Atom {
    if (this.currentToken === undefined) {
      throw new Error("Current token is undefined");
    }

    const atomName = this.currentToken.value!;
    this.eat(TokenType.Atom);
    return new Atom(atomName);
  }

  private parseFalsum(): Falsum {
    this.eat(TokenType.Falsum);
    return new Falsum();
  }
}

// Example usage and test cases
function testParser(input: string) {
  try {
    const tokenizer = new Tokenizer(input);
    const tokens = tokenizer.getTokens();
    const parser = new Parser(tokens);
    const formula = parser.parse();
    console.log("Input:", input);
    console.log("Formula:", formula.toString());
    console.log("-------------------------");
  } catch (error) {
    console.error("Error parsing input:", input);
    console.error(error);
    console.log("-------------------------");
  }
}

// // Test cases
// const testInputs = [
//   "A",
//   "\\bot",
//   "¬A",
//   "(A∨B)",
//   "(A∧B)",
//   "(A→B)",
//   "¬(A∨¬B)",
//   "((A∧B)→¬C)",
//   "(¬A∨(B∧C))",
//   "¬¬A",
//   "((A∨B) & (C ->  D))",
//   "¬(A→(¬B∨C))",
//   "((¬A)∨B)",
//   "(A∨)", // Invalid
//   "A∧", // Invalid
//   "(A∨B", // Invalid
// ];

// for (const input of testInputs) {
//   testParser(input);
// }

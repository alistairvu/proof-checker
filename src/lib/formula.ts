/**
 * Represents a propositional logic formula.
 */
export abstract class Formula {
  /**
   * Returns the children of the formula.
   *
   * @returns The children of the formula.
   */

  abstract getChildren(): Formula[];

  abstract toString(): string;

  abstract equals(other: Formula): boolean;
}

/**
 * Represents the constant Falsum.
 */
export class Falsum extends Formula {
  getChildren() {
    return [];
  }

  toString() {
    return "⊥";
  }

  equals(other: Formula) {
    return other instanceof Falsum;
  }
}

/**
 * Represents an atom in propositional logic.
 */
export class Atom extends Formula {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  getChildren(): Formula[] {
    return [];
  }

  toString() {
    return this.name;
  }

  equals(other: Formula) {
    return other instanceof Atom && other.name === this.name;
  }
}

/**
 * Represents a negation
 */
export class Negation extends Formula {
  form: Formula;

  constructor(form: Formula) {
    super();
    this.form = form;
  }

  getChildren(): Formula[] {
    return [this.form];
  }

  toString() {
    return `¬${this.form.toString()}`;
  }

  equals(other: Formula) {
    return other instanceof Negation && other.form.equals(this.form);
  }
}

/**
 * Represents a conjunction
 */
export class Conjunction extends Formula {
  left: Formula;
  right: Formula;

  constructor(left: Formula, right: Formula) {
    super();
    this.left = left;
    this.right = right;
  }

  getChildren(): Formula[] {
    return [this.left, this.right];
  }

  toString() {
    return `(${this.left.toString()} ∧ ${this.right.toString()})`;
  }

  equals(other: Formula) {
    return (
      other instanceof Conjunction &&
      other.left.equals(this.left) &&
      other.right.equals(this.right)
    );
  }
}

/**
 * Represents a disjunction
 */
export class Disjunction extends Formula {
  left: Formula;
  right: Formula;

  constructor(left: Formula, right: Formula) {
    super();
    this.left = left;
    this.right = right;
  }

  getChildren(): Formula[] {
    return [this.left, this.right];
  }

  toString() {
    return `(${this.left.toString()} ∨ ${this.right.toString()})`;
  }

  equals(other: Formula) {
    return (
      other instanceof Disjunction &&
      other.left.equals(this.left) &&
      other.right.equals(this.right)
    );
  }
}
/**
 * Represents an implication
 */
export class Implication extends Formula {
  left: Formula;
  right: Formula;

  constructor(left: Formula, right: Formula) {
    super();
    this.left = left;
    this.right = right;
  }

  getChildren(): Formula[] {
    return [this.left, this.right];
  }

  toString() {
    return `(${this.left.toString()} → ${this.right.toString()})`;
  }

  equals(other: Formula) {
    return (
      other instanceof Implication &&
      other.left.equals(this.left) &&
      other.right.equals(this.right)
    );
  }
}

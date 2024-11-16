/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// tests/AndElim.test.ts

import { AndElim } from "../lib/rules";
import { Conjunction, Atom } from "../lib/formula";
import { type ProofLine } from "../lib/rule";

describe("AndElim Rule Tests", () => {
  let formulaA: Atom;
  let formulaB: Atom;
  let formulaC: Atom;
  let conjunctionAB: Conjunction;
  let conjunctionABC: Conjunction;

  beforeEach(() => {
    formulaA = new Atom("A");
    formulaB = new Atom("B");
    formulaC = new Atom("C");
    conjunctionAB = new Conjunction(formulaA, formulaB);
    conjunctionABC = new Conjunction(conjunctionAB, formulaC);
  });

  test("Should correctly eliminate left conjunct from (A ∧ B)", () => {
    const premiseLine: ProofLine = {
      line: 1,
      assumptions: [1],
      formula: conjunctionAB,
      rule: new (class extends AndElim {
        toString() {
          return "Premise";
        }
      })(),
      references: [],
    };

    const derivedLine: ProofLine = {
      line: 2,
      assumptions: [1],
      formula: formulaA,
      rule: new AndElim(),
      references: [1],
    };

    const andElim = new AndElim();
    expect(() => {
      andElim.checkReferences([premiseLine, derivedLine]);
      andElim.checkAssumptions([premiseLine, derivedLine]);
      andElim.checkFormulas([premiseLine, derivedLine]);
    }).not.toThrow();
  });

  test("Should correctly eliminate right conjunct from (A ∧ B)", () => {
    const premiseLine: ProofLine = {
      line: 1,
      assumptions: [],
      formula: conjunctionAB,
      rule: new (class extends AndElim {
        toString() {
          return "Premise";
        }
      })(),
      references: [],
    };

    const derivedLine: ProofLine = {
      line: 2,
      assumptions: [],
      formula: formulaB,
      rule: new AndElim(),
      references: [1],
    };

    const andElim = new AndElim();
    expect(() => {
      andElim.checkReferences([premiseLine, derivedLine]);
      andElim.checkAssumptions([premiseLine, derivedLine]);
      andElim.checkFormulas([premiseLine, derivedLine]);
    }).not.toThrow();
  });

  test("Should correctly eliminate left conjunct from ((A ∧ B) ∧ C)", () => {
    const premiseLine: ProofLine = {
      line: 1,
      assumptions: [],
      formula: conjunctionABC,
      rule: new (class extends AndElim {
        toString() {
          return "Premise";
        }
      })(),
      references: [],
    };

    const derivedLine: ProofLine = {
      line: 2,
      assumptions: [],
      formula: conjunctionAB,
      rule: new AndElim(),
      references: [1],
    };

    const andElim = new AndElim();
    expect(() => {
      andElim.checkReferences([premiseLine, derivedLine]);
      andElim.checkAssumptions([premiseLine, derivedLine]);
      andElim.checkFormulas([premiseLine, derivedLine]);
    }).not.toThrow();
  });

  test("Should correctly eliminate right conjunct from ((A ∧ B) ∧ C)", () => {
    const premiseLine: ProofLine = {
      line: 1,
      assumptions: [],
      formula: conjunctionABC,
      rule: new (class extends AndElim {
        toString() {
          return "Premise";
        }
      })(),
      references: [],
    };

    const derivedLine: ProofLine = {
      line: 2,
      assumptions: [],
      formula: formulaC,
      rule: new AndElim(),
      references: [1],
    };

    const andElim = new AndElim();
    expect(() => {
      andElim.checkReferences([premiseLine, derivedLine]);
      andElim.checkAssumptions([premiseLine, derivedLine]);
      andElim.checkFormulas([premiseLine, derivedLine]);
    }).not.toThrow();
  });

  // Negative Test Cases

  test("Should throw error when premise is not a conjunction", () => {
    const premiseLine: ProofLine = {
      line: 1,
      assumptions: [],
      formula: formulaA,
      rule: new (class extends AndElim {
        toString() {
          return "Premise";
        }
      })(),
      references: [],
    };

    const derivedLine: ProofLine = {
      line: 2,
      assumptions: [],
      formula: formulaA,
      rule: new AndElim(),
      references: [1],
    };

    const andElim = new AndElim();
    expect(() => {
      andElim.checkFormulas([premiseLine, derivedLine]);
    }).toThrowError(`Line 1 must be a conjunction to apply rule ∧ Elim`);
  });

  test("Should throw error when references are incorrect", () => {
    const premiseLine: ProofLine = {
      line: 1,
      assumptions: [],
      formula: conjunctionAB,
      rule: new (class extends AndElim {
        toString() {
          return "Premise";
        }
      })(),
      references: [],
    };

    const anotherPremiseLine: ProofLine = {
      line: 2,
      assumptions: [],
      formula: formulaC,
      rule: new (class extends AndElim {
        toString() {
          return "Another Premise";
        }
      })(),
      references: [],
    };

    const derivedLine: ProofLine = {
      line: 3,
      assumptions: [],
      formula: formulaA,
      rule: new AndElim(),
      references: [2], // Incorrect reference; should reference line 1
    };

    const andElim = new AndElim();
    expect(() => {
      andElim.checkReferences([premiseLine, derivedLine]);
    }).toThrowError("Incorrect set of references.");
  });

  test("Should throw error when references array length is not one", () => {
    const premiseLine: ProofLine = {
      line: 1,
      assumptions: [],
      formula: conjunctionAB,
      rule: new (class extends AndElim {
        toString() {
          return "Premise";
        }
      })(),
      references: [],
    };

    const derivedLine: ProofLine = {
      line: 2,
      assumptions: [],
      formula: formulaA,
      rule: new AndElim(),
      references: [1, 3], // Too many references
    };

    const andElim = new AndElim();
    expect(() => {
      andElim.checkReferences([premiseLine, derivedLine]);
    }).toThrowError("∧ Elim only accepts one reference");
  });

  test("Should throw error when derived formula is not a conjunct", () => {
    const premiseLine: ProofLine = {
      line: 1,
      assumptions: [],
      formula: conjunctionAB,
      rule: new (class extends AndElim {
        toString() {
          return "Premise";
        }
      })(),
      references: [],
    };

    const derivedLine: ProofLine = {
      line: 2,
      assumptions: [],
      formula: formulaC, // Not a conjunct of (A ∧ B)
      rule: new AndElim(),
      references: [1],
    };

    const andElim = new AndElim();
    expect(() => {
      andElim.checkFormulas([premiseLine, derivedLine]);
    }).toThrowError(
      `Cannot apply rule ∧ Elim with formulae (${formulaA.toString()} ∧ ${formulaB.toString()}) and ${formulaC.toString()}`,
    );
  });

  test("Should throw error when assumptions do not match", () => {
    const premiseLine: ProofLine = {
      line: 1,
      assumptions: [1],
      formula: conjunctionAB,
      rule: new (class extends AndElim {
        toString() {
          return "Premise";
        }
      })(),
      references: [],
    };

    const derivedLine: ProofLine = {
      line: 2,
      assumptions: [2], // Different assumptions
      formula: formulaA,
      rule: new AndElim(),
      references: [1],
    };

    const andElim = new AndElim();
    expect(() => {
      andElim.checkAssumptions([premiseLine, derivedLine]);
    }).toThrowError("Incorrect set of assumptions");
  });

  test("Should throw error when insufficient lines are provided", () => {
    const premiseLine: ProofLine = {
      line: 1,
      assumptions: [],
      formula: conjunctionAB,
      rule: new (class extends AndElim {
        toString() {
          return "Premise";
        }
      })(),
      references: [],
    };

    // Only one line provided instead of two
    const derivedLine = undefined;

    const andElim = new AndElim();
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      andElim.checkReferences([premiseLine, derivedLine as any]);
    }).toThrowError("∧ Elim operates on two lines");
  });
});

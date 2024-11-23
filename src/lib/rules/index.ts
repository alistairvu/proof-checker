import { type Rule } from "../rule";
import { AndElim } from "./AndElim";
import { AndIntro } from "./AndIntro";
import { AsmpIntro } from "./AsmpIntro";
import { FalsumElim } from "./FalsumElim";
import { FalsumIntro } from "./FalsumIntro";
import { NotElim } from "./NotElim";
import { NotIntro } from "./NotIntro";
import { OrElim } from "./OrElim";
import { OrIntro } from "./OrIntro";
import { ToElim } from "./ToElim";
import { ToIntro } from "./ToIntro";

export { AndElim } from "./AndElim";
export { AndIntro } from "./AndIntro";

export { OrIntro } from "./OrIntro";
export { OrElim } from "./OrElim";

export { ToElim } from "./ToElim";
export { ToIntro } from "./ToIntro";

export { FalsumIntro } from "./FalsumIntro";
export { FalsumElim } from "./FalsumElim";

export { NotIntro } from "./NotIntro";
export { NotElim } from "./NotElim";

export const VALID_RULES: { name: string; rule: Rule; use?: string }[] = [
  {
    name: new AsmpIntro().toString(),
    rule: new AsmpIntro(),
    use: `Assumption Introduction does not expect any references.`,
  },
  {
    name: new AndElim().toString(),
    rule: new AndElim(),
    use: `Conjunction Elimination expects one reference: formula A ∧ B`,
  },
  {
    name: new AndIntro().toString(),
    rule: new AndIntro(),
    use: `Conjunction Introduction expects two references, in this order: formula A and formula B`,
  },
  {
    name: new OrElim().toString(),
    rule: new OrElim(),
    use: `Disjunction Elimination expects five references, in this order:
    
1. Formula A ∨ B
2. Formula A as an assumption
3. Formula C with formula A is an assumption
4. Formula B as an assumption
5. Formula C with formula B as an assumption`,
  },
  {
    name: new OrIntro().toString(),
    rule: new OrIntro(),
    use: "Disjunction Introduction expects only one reference.",
  },
  {
    name: new ToElim().toString(),
    rule: new ToElim(),
    use: `Implication Elimination expects two references, in this order:
    
1. Formula A → B
2. Formula A`,
  },
  {
    name: new ToIntro().toString(),
    rule: new ToIntro(),
    use: `Implication Introduction expects two references, in this order:
    
1. Formula A as an assumption
2. Formula B, with A as an assumption`,
  },
  {
    name: new FalsumIntro().toString(),
    rule: new FalsumIntro(),
    use: `Falsum Introduction expects two references, in this order:
    
1. Formula A
2. Formula ¬A`,
  },
  {
    name: new FalsumElim().toString(),
    rule: new FalsumElim(),
    use: "Falsum Elimination expects one reference: ⊥.",
  },
  {
    name: new NotIntro().toString(),
    rule: new NotIntro(),
    use: `Negation Introduction expects two references, in this order:
    
1. Formula A as an assumption
2. ⊥, with A as an assumption`,
  },
  {
    name: new NotElim().toString(),
    rule: new NotElim(),
    use: `Negation Elimination expects two references, in this order:
    
1. Formula ¬A as an assumption
2. ⊥, with ¬A as an assumption`,
  },
];

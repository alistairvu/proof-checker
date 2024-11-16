import { Rule } from "../rule";
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
    name: "Assumption Introduction",
    rule: new AsmpIntro(),
    use: `Assumption Introduction does not expect any references.`,
  },
  {
    name: "Conjunction Elimination",
    rule: new AndElim(),
    use: `Conjunction Elimination expects one reference:
    
1. Formula A ∧ B`,
  },
  {
    name: "Conjunction Introduction",
    rule: new AndIntro(),
    use: `Conjunction Introduction expects two references, in this order:
    
1. Formula A
2. Formula B`,
  },
  { name: "Disjunction Elimination", rule: new OrElim() },
  { name: "Disjunction Introduction", rule: new OrIntro() },
  { name: "Implication Elimination", rule: new ToElim() },
  { name: "Implication Introduction", rule: new ToIntro() },
  { name: "Falsum Introduction", rule: new FalsumIntro() },
  { name: "Falsum Elimination", rule: new FalsumElim() },
  { name: "Negation Introduction", rule: new NotIntro() },
  { name: "Negation Elimination", rule: new NotElim() },
];

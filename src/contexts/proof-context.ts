import { createContext, type Dispatch, type SetStateAction, use } from "react";
import { type Formula } from "~/lib/formula";
import { type ProofLine } from "~/lib/rule";

export type Proof = {
  lines: ProofLine[];
  premises: ProofLine[];
  conclusion: Formula;
};

export type ProofContextValue = {
  proof: Proof | null;
  setProof: Dispatch<SetStateAction<Proof | null>>;
};

export const ProofContext = createContext<ProofContextValue | null>(null);

export const useProofContext = () => {
  return use(ProofContext);
};

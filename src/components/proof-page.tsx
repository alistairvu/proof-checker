"use client";

import { useState } from "react";
import { type Proof, ProofContext } from "~/contexts/proof-context";
import { ProofEntry } from "./proof-entry";
import { ProofTable } from "./proof-table";

export const ProofPage = () => {
  const [proof, setProof] = useState<Proof | null>(null);

  return (
    <ProofContext.Provider value={{ proof, setProof }}>
      {proof ? <ProofTable /> : <ProofEntry />}
    </ProofContext.Provider>
  );
};

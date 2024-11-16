"use client";

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useProofContext } from "~/contexts/proof-context";
import { Parser } from "~/lib/parser";
import { Tokenizer } from "~/lib/tokenizer";
import { type ProofLine } from "~/lib/rule";
import { AsmpIntro } from "~/lib/rules/AsmpIntro";

export const ProofEntry = () => {
  const [proofInput, setProofInput] = useState("");
  const [error, setError] = useState("");
  const proofContext = useProofContext();

  if (proofContext === null) {
    return null;
  }

  const { setProof } = proofContext;

  const handleAddProof = () => {
    setError("");

    try {
      const formulae = proofInput.split("\n").map((line) => {
        try {
          const tokenizer = new Tokenizer(line);
          const tokens = tokenizer.getTokens();
          const parser = new Parser(tokens);
          return parser.parse();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_e) {
          const tokenizer = new Tokenizer(`(${line})`);
          const tokens = tokenizer.getTokens();
          const parser = new Parser(tokens);
          return parser.parse();
        }
      });

      const conclusion = formulae.pop();

      if (conclusion === undefined) {
        throw new Error("There should be a conclusion.");
      }

      const premises: ProofLine[] = formulae.map((formula, index) => ({
        line: index + 1,
        assumptions: [index + 1],
        formula,
        rule: new AsmpIntro(),
        references: [],
      }));

      setProof({
        lines: premises,
        premises,
        conclusion,
      });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="flex flex-auto flex-col items-start gap-2">
      <p>
        Enter your premises and your conclusions here, one formula at a time.
        The conclusion should be the last line you enter.
      </p>

      <Textarea
        placeholder="Enter your proof here..."
        value={proofInput}
        rows={8}
        onChange={(e) => setProofInput(e.target.value)}
      />

      {error}

      <Button onClick={handleAddProof}>Begin Proof</Button>
    </div>
  );
};

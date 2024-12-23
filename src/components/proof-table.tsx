"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useProofContext } from "~/contexts/proof-context";
import { type ProofLine } from "~/lib/rule";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { Input } from "./ui/input";
import { PlusIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { useMemo, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { VALID_RULES } from "~/lib/rules";
import { Parser } from "~/lib/parser";
import { Tokenizer } from "~/lib/tokenizer";
import { Falsum, type Formula } from "~/lib/formula";

const proofTableColumns: ColumnDef<ProofLine>[] = [
  {
    accessorKey: "line",
    header: "Line",
  },
  {
    accessorKey: "assumptions",
    header: "Assumptions",
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const assumptions = row.getValue("assumptions") as number[];

      return assumptions.join(", ");
    },
  },
  {
    accessorKey: "formula",
    header: "Formula",
  },
  {
    accessorKey: "rule",
    header: "Justification",
  },
  {
    accessorKey: "references",
    header: "References",
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const references = row.getValue("references") as number[];

      return references.join(", ");
    },
  },
];

export const ProofTable = () => {
  const { proof, setProof } = useProofContext()!;

  const [nextLine, setNextLine] = useState({
    assumptions: "",
    formula: "",
    justification: "Assumption Introduction",
    references: "",
  });

  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const table = useReactTable({
    data: proof?.lines ?? [],
    columns: proofTableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  /**
   * Verifies if the proof is complete or not.
   *
   * @returns true if the proof is complete
   */
  const isProofComplete = useMemo(() => {
    if (proof == null) {
      return false;
    }

    const finalLine = proof.lines[proof.lines.length - 1];

    if (finalLine === undefined) {
      return false;
    }

    if (!finalLine.formula.equals(proof.conclusion)) {
      return false;
    }

    for (const assumption of finalLine.assumptions) {
      if (assumption < 1 || assumption > proof.premises.length) {
        return false;
      }
    }

    return true;
  }, [proof]);

  /**
   * Handles the addition of a new proof line into the proof.
   *
   * @returns
   */
  const addProofLine = () => {
    if (proof === null) {
      return;
    }

    setError("");

    const assumptions =
      nextLine.assumptions.trim().length === 0
        ? []
        : nextLine.assumptions
            .trim()
            .split(/[\s,]+/)
            .map((x) => parseInt(x));

    for (const value of assumptions) {
      if (isNaN(value)) {
        setError("Error in parsing assumptions.");
        return;
      }
    }

    const references =
      nextLine.references.trim().length === 0
        ? []
        : nextLine.references
            .trim()
            .split(/[\s,]+/)
            .map((x) => parseInt(x));

    for (const value of references) {
      if (isNaN(value)) {
        setError("Error in parsing references.");
        return;
      }
    }

    let formula: Formula = new Falsum();

    try {
      const tokenizer = new Tokenizer(nextLine.formula);
      const tokens = tokenizer.getTokens();
      const parser = new Parser(tokens);
      formula = parser.parse();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      try {
        const tokenizer = new Tokenizer(`(${nextLine.formula})`);
        const tokens = tokenizer.getTokens();
        const parser = new Parser(tokens);
        formula = parser.parse();
      } catch (e) {
        setError(`Error while parsing formula: ${(e as Error).message}`);
        return;
      }
    }

    // Parsing justification
    const ruleMatch = VALID_RULES.find(
      (x) => x.name === nextLine.justification,
    );

    if (ruleMatch === undefined) {
      setError(`Error: unknown rule ${nextLine.justification}.`);
      return;
    }

    // Checking validity
    const rule = ruleMatch.rule;

    const proofLines = references
      .map((x) => proof.lines[x - 1])
      .filter((x) => x !== undefined);

    const parsedLine: ProofLine = {
      line: (proof.lines[proof.lines.length - 1]?.line ?? 0) + 1,
      assumptions,
      rule,
      references,
      formula,
    };

    proofLines.push(parsedLine);

    try {
      rule.validate(proofLines);
    } catch (e) {
      setError(`Error while applying rule: ${(e as Error).message}`);
      return;
    }

    setProof((prev) =>
      prev === null
        ? null
        : {
            ...prev,
            lines: [...prev.lines, parsedLine],
          },
    );

    setNextLine({
      assumptions: "",
      formula: "",
      justification: "Assumption Introduction",
      references: "",
    });

    inputRef.current?.focus();
  };

  const ruleUse = useMemo(() => {
    // Parsing justification
    const ruleMatch = VALID_RULES.find(
      (x) => x.name === nextLine.justification,
    );

    return ruleMatch?.use;
  }, [nextLine.justification]);

  const removeProofLine = (line: number) => {
    if (proof === null) {
      return;
    }

    if (line <= proof.premises.length) {
      return;
    }

    setProof((prev) =>
      prev === null
        ? null
        : {
            ...prev,
            lines: prev?.lines.filter((x) => x.line !== line),
          },
    );
  };

  if (proof === null) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <p>
        To prove: {proof?.premises.map((x) => x.formula).join(", ")} ⊢{" "}
        {proof?.conclusion.toString()}
      </p>

      <div className="w-full rounded-md border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProofLine();
          }}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                  <TableHead />
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  {row.original.line > proof.premises.length &&
                  !isProofComplete ? (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => removeProofLine(row.original.line)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <div className="h-9"></div>
                    </TableCell>
                  )}
                </TableRow>
              ))}

              {!isProofComplete && (
                <TableRow>
                  <TableCell>
                    {(proof.lines[proof.lines.length - 1]?.line ?? 0) + 1}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      ref={inputRef}
                      placeholder="Assumption"
                      value={nextLine.assumptions}
                      onChange={(e) =>
                        setNextLine((line) => ({
                          ...line,
                          assumptions: e.target.value,
                        }))
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      type="text"
                      placeholder="Formula"
                      value={nextLine.formula}
                      onChange={(e) =>
                        setNextLine((line) => ({
                          ...line,
                          formula: e.target.value,
                        }))
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Select
                      value={nextLine.justification}
                      onValueChange={(value) => {
                        setNextLine((prev) => ({
                          ...prev,
                          justification: value,
                        }));
                      }}
                    >
                      <SelectTrigger tabIndex={0}>
                        {nextLine.justification}
                      </SelectTrigger>
                      <SelectContent>
                        {VALID_RULES.map((rule) => (
                          <SelectItem key={rule.name} value={rule.name}>
                            {rule.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Input
                      type="text"
                      placeholder="References"
                      value={nextLine.references}
                      onChange={(e) =>
                        setNextLine((line) => ({
                          ...line,
                          references: e.target.value,
                        }))
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Button size="icon" type="submit">
                      <PlusIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </form>
      </div>

      {ruleUse && !isProofComplete && (
        <div className="w-full whitespace-break-spaces rounded border border-blue-700 bg-blue-100 p-2 text-blue-700">
          {ruleUse}
        </div>
      )}

      {error && (
        <div className="w-full rounded border border-rose-700 bg-rose-100 p-2 text-rose-700">
          {error}
        </div>
      )}

      {isProofComplete && (
        <div className="w-full rounded border border-green-700 bg-green-100 p-2 text-green-700">
          Congratulations! You have completed your proof. Lines:{" "}
          {proof.lines.length}
        </div>
      )}

      <Button onClick={() => setProof(null)}>Do another proof</Button>
    </div>
  );
};

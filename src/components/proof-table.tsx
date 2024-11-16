"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useProofContext } from "~/contexts/proof-context";
import { type Rule, type ProofLine } from "~/lib/rule";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { Input } from "./ui/input";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { VALID_RULES } from "~/lib/rules";
import { Parser } from "~/lib/parser";
import { Tokenizer } from "~/lib/tokenizer";
import { useRouter } from "next/navigation";

const proofTableColumns: ColumnDef<ProofLine>[] = [
  {
    accessorKey: "line",
    header: "Line",
  },
  {
    accessorKey: "assumptions",
    header: "Assumptions",
    cell: ({ row }) => (row.getValue("assumptions") as number[]).join(", "),
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
    cell: ({ row }) => (row.getValue("references") as number[]).join(", "),
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
  const router = useRouter();

  const table = useReactTable({
    data: proof?.lines ?? [],
    columns: proofTableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isProofComplete = () => {
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
  };

  const addProofLine = () => {
    if (proof === null) {
      return;
    }

    setError("");

    try {
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

      const tokenizer = new Tokenizer(nextLine.formula);
      const tokens = tokenizer.getTokens();
      const parser = new Parser(tokens);
      const formula = parser.parse();

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
        line: proof.lines.length + 1,
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
    } catch (e) {
      setError(`Error while parsing formula: ${(e as Error).message}`);
    }
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {!isProofComplete() && (
              <TableRow>
                <TableCell>{proof.lines.length + 1}</TableCell>
                <TableCell>
                  <Input
                    type="text"
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
                    <SelectTrigger>{nextLine.justification}</SelectTrigger>
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
                  <Button size="icon" onClick={addProofLine}>
                    <PlusIcon />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {error && (
        <div className="w-full rounded border border-rose-700 bg-rose-100 p-1 text-rose-700">
          {error}
        </div>
      )}

      {isProofComplete() && (
        <>
          <div className="w-full rounded border-green-700 bg-green-100 p-1 text-green-700">
            Congratulations! You have completed your proof. Lines:{" "}
            {proof.lines.length}
          </div>

          <Button onClick={(e) => setProof(null)}>Do another proof</Button>
        </>
      )}
    </div>
  );
};

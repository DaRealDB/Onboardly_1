import React, { useState } from "react";
import { FileText, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const fileRecords = [
  {
    id: 1,
    fileName: "Offer Letter.pdf",
    person: "James Rivera",
    company: "Acme Corp",
    type: "Offer Letters",
    dateUploaded: "Apr 28, 2025",
  },
  {
    id: 2,
    fileName: "I-9 Form.pdf",
    person: "Priya Sharma",
    company: "Globex Corp",
    type: "I-9 Documents",
    dateUploaded: "Apr 25, 2025",
  },
  {
    id: 3,
    fileName: "Background Check.pdf",
    person: "Tom Nakamura",
    company: "CloudNine Inc",
    type: "Background Checks",
    dateUploaded: "Apr 22, 2025",
  },
  {
    id: 4,
    fileName: "NDA.pdf",
    person: "Lisa Park",
    company: "NovaPay",
    type: "Signed NDAs",
    dateUploaded: "Apr 20, 2025",
  },
  {
    id: 5,
    fileName: "Offer Letter.pdf",
    person: "David Chen",
    company: "Acme Corp",
    type: "Offer Letters",
    dateUploaded: "Apr 18, 2025",
  },
  {
    id: 6,
    fileName: "I-9 Form.pdf",
    person: "Maria Santos",
    company: "Vertex Labs",
    type: "I-9 Documents",
    dateUploaded: "Apr 15, 2025",
  },
  {
    id: 7,
    fileName: "Background Check.pdf",
    person: "Kevin Wright",
    company: "TechFlow Inc",
    type: "Background Checks",
    dateUploaded: "Apr 12, 2025",
  },
  {
    id: 8,
    fileName: "NDA.pdf",
    person: "Aisha Patel",
    company: "BrightPath HR",
    type: "Signed NDAs",
    dateUploaded: "Apr 10, 2025",
  },
];

const typeColors: Record<string, string> = {
  "Offer Letters": "bg-primary/10 text-primary",
  "I-9 Documents": "bg-success/10 text-success",
  "Background Checks": "bg-warning/10 text-warning",
  "Signed NDAs": "bg-chart-2/10 text-chart-2",
};

export default function VaultPage() {
  const [search, setSearch] = useState("");
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const filtered = fileRecords.filter(
    (f) =>
      !deletedIds.has(f.id) &&
      (f.fileName.toLowerCase().includes(search.toLowerCase()) ||
        f.person.toLowerCase().includes(search.toLowerCase()) ||
        f.company.toLowerCase().includes(search.toLowerCase()) ||
        f.type.toLowerCase().includes(search.toLowerCase())),
  );

  const handleDelete = (id: number) => {
    setDeletedIds((prev) => new Set([...prev, id]));
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Global Document Vault
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Platform-wide file storage, digital signatures, and document records
        </p>
      </div>

      {/* File Records Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            File Records
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Browse and manage individual documents across all tenants
          </p>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search file, person, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">File Name</TableHead>
              <TableHead className="font-semibold">Person Name</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">
                Company
              </TableHead>
              <TableHead className="font-semibold hidden lg:table-cell">
                Date Uploaded
              </TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((file) => (
              <TableRow
                key={file.id}
                className="group hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {file.fileName}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-medium px-1.5 mt-0.5 ${typeColors[file.type] || "bg-muted text-muted-foreground"}`}
                      >
                        {file.type}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">{file.person}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {file.company}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {file.dateUploaded}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all h-7 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground text-sm"
                >
                  No files match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

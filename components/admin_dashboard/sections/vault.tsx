import React, { useState, useEffect } from "react";
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
import { createClient } from "@/lib/supabase/client";

export default function VaultPage() {
  const [search, setSearch] = useState("");
  const [fileRecords, setFileRecords] = useState<any[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const supabase = createClient();

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from("client_documents")
        .select(
          `
          id, 
          attachment_name, 
          step_title, 
          uploaded_at,
          clients (
            full_name,
            companies (name)
          )
        `,
        )
        .order("uploaded_at", { ascending: false });

      if (data) {
        const mapped = data.map((doc: any) => ({
          id: doc.id,
          fileName: doc.attachment_name,
          person: doc.clients?.full_name || "Unknown User",
          company: doc.clients?.companies?.name || "Unknown Company",
          type: doc.step_title || "Document",
          dateUploaded: new Date(doc.uploaded_at).toLocaleDateString(),
        }));
        setFileRecords(mapped);
      }
    };

    fetchDocuments();
  }, [supabase]);

  const filtered = fileRecords.filter(
    (f) =>
      !deletedIds.has(f.id) &&
      (f.fileName.toLowerCase().includes(search.toLowerCase()) ||
        f.person.toLowerCase().includes(search.toLowerCase()) ||
        f.company.toLowerCase().includes(search.toLowerCase()) ||
        f.type.toLowerCase().includes(search.toLowerCase())),
  );

  const handleDelete = async (id: string) => {
    setDeletedIds((prev) => new Set([...prev, id]));
    await supabase.from("client_documents").delete().eq("id", id);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Global Document Vault
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Platform-wide file storage, digital signatures, and document records
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            File Records
          </h2>
        </div>

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
                        className="text-[10px] font-medium px-1.5 mt-0.5 bg-primary/10 text-primary"
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

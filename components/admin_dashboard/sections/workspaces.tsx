import React, { useState, useEffect } from "react";
import { Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function WorkspacesPage() {
  const [search, setSearch] = useState("");
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, slug, created_at, clients(id)");

      if (error) {
        console.error("Error fetching workspaces:", error);
        return;
      }

      if (data) {
        const mapped = data.map((company: any) => ({
          id: company.id,
          name: company.name,
          subdomain: company.slug,
          candidates: company.clients?.length || 0,
        }));
        setWorkspaces(mapped);
      }
    };

    fetchWorkspaces();
  }, [supabase]);

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    // This specifically targets only the company row
    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", deletingId);

    if (error) {
      console.error("Error deleting workspace:", error);
      alert(`Delete failed: ${error.message}. Did you run the SQL policy?`);
    } else {
      // Remove the deleted workspace from the UI
      setWorkspaces((prev) => prev.filter((w) => w.id !== deletingId));
    }

    setIsDeleting(false);
    setDeletingId(null);
  };

  const filtered = workspaces.filter((w) => {
    return (
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      (w.subdomain && w.subdomain.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl relative">
      <div>
        <h1 className="text-xl font-bold text-foreground">Workspaces</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {workspaces.length} active tenants on the platform
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by company name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Candidates</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((ws) => (
              <TableRow
                key={ws.id}
                className="group hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{ws.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ws.subdomain || "No slug"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {ws.candidates.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(ws.id)}
                    className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all h-7 text-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-12 text-muted-foreground"
                >
                  No workspaces match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border p-6 rounded-xl shadow-lg max-w-sm w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Workspace?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this workspace? This action cannot
              be undone and will permanently erase all associated clients,
              documents, and data.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

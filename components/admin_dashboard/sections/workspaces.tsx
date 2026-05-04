import React, { useState } from "react";
import { Search, Filter, Trash2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const workspaces = [
  {
    id: 1,
    name: "Acme Corp",
    subdomain: "acme",
    status: "active",
    candidates: 1240,
  },
  {
    id: 2,
    name: "TechFlow Inc",
    subdomain: "techflow",
    status: "active",
    candidates: 892,
  },
  {
    id: 3,
    name: "Globex Corp",
    subdomain: "globex",
    status: "error",
    candidates: 2105,
  },
  {
    id: 4,
    name: "NovaPay",
    subdomain: "novapay",
    status: "active",
    candidates: 567,
  },
  {
    id: 5,
    name: "Vertex Labs",
    subdomain: "vertex",
    status: "active",
    candidates: 3201,
  },
  {
    id: 6,
    name: "BrightPath HR",
    subdomain: "brightpath",
    status: "active",
    candidates: 445,
  },
  {
    id: 7,
    name: "CloudNine Inc",
    subdomain: "cloudnine",
    status: "error",
    candidates: 178,
  },
  {
    id: 8,
    name: "Horizon Labs",
    subdomain: "horizon",
    status: "active",
    candidates: 94,
  },
];

export default function WorkspacesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = workspaces.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.subdomain.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Workspaces</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {workspaces.length} active tenants on the platform
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or subdomain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Candidates</TableHead>
              <TableHead className="w-20"></TableHead>
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
                      {ws.subdomain}.onboardly.app
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
                  No workspaces match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Imports
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  FolderLock,
  Calendar,
  Loader2,
  RotateCcw,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type DocumentStatus = "pending" | "accepted" | "change-requested";

type DocumentRecord = {
  id: string;
  client_id: string;
  step_title: string;
  attachment_name: string;
  status: DocumentStatus;
  uploaded_at: string;
  clients: { full_name: string } | null;
};

type SortField =
  | "attachment_name"
  | "employeeName"
  | "step_title"
  | "status"
  | "uploaded_at";
type SortOrder = "asc" | "desc";

// Main Component
export function VaultModule() {
  const supabase = createClient();
  const { toast } = useToast();

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("uploaded_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from("client_documents")
        .select(
          `
          *,
          clients (
            full_name
          )
        `,
        )
        .order("uploaded_at", { ascending: false });

      if (data) {
        setDocuments(data as unknown as DocumentRecord[]);
      }
      setIsLoading(false);
    };

    fetchDocuments();
  }, [supabase]);

  const filteredAndSortedDocs = useMemo(() => {
    return documents
      .filter((doc) => {
        const clientName = doc.clients?.full_name || "";
        const matchesSearch =
          doc.attachment_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          clientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || doc.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case "attachment_name":
            comparison = a.attachment_name.localeCompare(b.attachment_name);
            break;
          case "employeeName":
            const nameA = a.clients?.full_name || "";
            const nameB = b.clients?.full_name || "";
            comparison = nameA.localeCompare(nameB);
            break;
          case "step_title":
            comparison = a.step_title.localeCompare(b.step_title);
            break;
          case "status":
            comparison = a.status.localeCompare(b.status);
            break;
          case "uploaded_at":
            comparison =
              new Date(a.uploaded_at).getTime() -
              new Date(b.uploaded_at).getTime();
            break;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [documents, searchQuery, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: DocumentStatus) => {
    const { error } = await supabase
      .from("client_documents")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setDocuments((docs) =>
        docs.map((d) => (d.id === id ? { ...d, status: newStatus } : d)),
      );
      toast({
        title: "Status Updated",
        description: `Document has been marked as ${newStatus.replace("-", " ")}.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update document status.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "change-requested":
        return <RotateCcw className="h-4 w-4 text-orange-600" />;
    }
  };

  const stats = {
    total: documents.length,
    pending: documents.filter(
      (d) => d.status === "pending" || d.status === "change-requested",
    ).length,
    approved: documents.filter((d) => d.status === "accepted").length,
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">The Vault</h1>
        <p className="text-muted-foreground mt-1">
          Central repository for all submitted client documents
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.pending}
                </p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.approved}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedDocs.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="py-12 text-center">
            <FolderLock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground">No documents found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Documents uploaded by clients will appear here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("attachment_name")}
                >
                  <div className="flex items-center gap-2">
                    File Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("employeeName")}
                >
                  <div className="flex items-center gap-2">
                    Client
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("step_title")}
                >
                  <div className="flex items-center gap-2">
                    Type
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("uploaded_at")}
                >
                  <div className="flex items-center gap-2">
                    Uploaded
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium truncate max-w-[200px] inline-block">
                        {doc.attachment_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.clients?.full_name}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {doc.step_title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <span
                        className={cn(
                          "text-sm capitalize",
                          doc.status === "accepted" && "text-green-600",
                          doc.status === "pending" && "text-amber-600",
                          doc.status === "change-requested" &&
                            "text-orange-600",
                        )}
                      >
                        {doc.status.replace("-", " ")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(doc.uploaded_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewDoc(doc)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        {doc.status !== "accepted" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(doc.id, "accepted")
                              }
                              className="text-green-600"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Accept
                            </DropdownMenuItem>
                          </>
                        )}
                        {doc.status !== "change-requested" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(doc.id, "change-requested")
                            }
                            className="text-orange-600"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Request Change
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {previewDoc && (
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {previewDoc.attachment_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-2" />
                  <p>Document Preview</p>
                  <p className="text-sm">Preview not available in demo</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{previewDoc.clients?.full_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{previewDoc.step_title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(previewDoc.status)}
                    <span className="font-medium capitalize">
                      {previewDoc.status.replace("-", " ")}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded</p>
                  <p className="font-medium">
                    {formatDate(previewDoc.uploaded_at)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                {previewDoc.status !== "accepted" && (
                  <Button
                    variant="outline"
                    className="text-green-600 hover:text-green-600 gap-2 flex-1"
                    onClick={() => {
                      handleUpdateStatus(previewDoc.id, "accepted");
                      setPreviewDoc(null);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Accept
                  </Button>
                )}
                {previewDoc.status !== "change-requested" && (
                  <Button
                    variant="outline"
                    className="text-orange-600 hover:text-orange-600 gap-2 flex-1"
                    onClick={() => {
                      handleUpdateStatus(previewDoc.id, "change-requested");
                      setPreviewDoc(null);
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Request Change
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

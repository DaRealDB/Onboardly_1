// Imports
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  UserPlus,
  Clock,
  CheckCircle2,
  MoreVertical,
  Mail,
  FileText,
  Eye,
  Key,
  Copy,
  Trash2,
  Check,
  X,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type TabValue = "pending" | "hired";

type ClientRecord = {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  status: string;
  assigned_track_id: string | null;
  temp_username?: string;
  temp_password?: string;
  requested_documents?: string[];
  created_at: string;
  hired_at?: string;
};

type DocumentRecord = {
  id: string;
  client_id: string;
  step_title: string;
  attachment_name: string;
  status: "pending" | "accepted" | "change-requested";
  uploaded_at: string;
};

type WorkflowStepRecord = {
  id: string;
  track_id: string;
  step_order: number;
  title: string;
  attachment_type: string;
};

// Main Component
export function PeopleModule() {
  const supabase = createClient();
  const { toast } = useToast();

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [tracks, setTracks] = useState<{ id: string; name: string }[]>([]);
  const [snippets, setSnippets] = useState<{ id: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabValue>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [viewCredentialsDialog, setViewCredentialsDialog] =
    useState<ClientRecord | null>(null);
  const [requestDocumentDialog, setRequestDocumentDialog] =
    useState<ClientRecord | null>(null);
  const [selectedSnippetId, setSelectedSnippetId] = useState("");
  const [isRequestingDoc, setIsRequestingDoc] = useState(false);
  const [viewDocumentsDialog, setViewDocumentsDialog] =
    useState<ClientRecord | null>(null);
  const [finalizeHireDialog, setFinalizeHireDialog] =
    useState<ClientRecord | null>(null);

  // Init Data
  useEffect(() => {
    const initData = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data: teamData } = await supabase
        .from("team_members")
        .select("company_id")
        .eq("user_id", authData.user.id)
        .single();

      if (teamData) {
        setCompanyId(teamData.company_id);

        const [clientsRes, tracksRes, snippetsRes] = await Promise.all([
          supabase
            .from("clients")
            .select("*")
            .eq("company_id", teamData.company_id)
            .order("created_at", { ascending: false }),
          supabase
            .from("workflow_tracks")
            .select("id, name")
            .eq("company_id", teamData.company_id),
          supabase
            .from("document_snippets")
            .select("id, title")
            .eq("company_id", teamData.company_id),
        ]);

        if (clientsRes.data) setClients(clientsRes.data);
        if (tracksRes.data) setTracks(tracksRes.data);
        if (snippetsRes.data) setSnippets(snippetsRes.data);
      }
      setIsLoading(false);
    };

    initData();
  }, [supabase]);

  // Derived State
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "pending") {
      return matchesSearch && client.status === "pending";
    }
    if (activeTab === "hired") {
      return matchesSearch && client.status === "hired";
    }
    return matchesSearch;
  });

  const counts = {
    pending: clients.filter((c) => c.status === "pending").length,
    hired: clients.filter((c) => c.status === "hired").length,
  };

  // Actions
  const handleResetPassword = async (client: ClientRecord) => {
    const newPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const { error } = await supabase
      .from("clients")
      .update({ temp_password: newPassword })
      .eq("id", client.id);

    if (!error) {
      setClients(
        clients.map((c) =>
          c.id === client.id ? { ...c, temp_password: newPassword } : c,
        ),
      );
      toast({
        title: "Password Reset",
        description: `New temporary password generated for ${client.full_name}`,
      });
    }
  };

  const handleDeleteClient = async (id: string) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (!error) {
      setClients(clients.filter((c) => c.id !== id));
      toast({
        title: "Account Deleted",
        description: "The client record has been removed.",
      });
    }
  };

  const onHireSuccess = (clientId: string) => {
    setClients(
      clients.map((c) =>
        c.id === clientId
          ? { ...c, status: "hired", hired_at: new Date().toISOString() }
          : c,
      ),
    );
    setFinalizeHireDialog(null);
    toast({
      title: "Hire Finalized",
      description: "The client has been successfully hired.",
    });
  };

  const handleSendDocumentRequest = async () => {
    if (!requestDocumentDialog || !selectedSnippetId) return;

    setIsRequestingDoc(true);
    const snippet = snippets.find((s) => s.id === selectedSnippetId);
    if (!snippet) {
      setIsRequestingDoc(false);
      return;
    }

    const currentReqs = requestDocumentDialog.requested_documents || [];
    if (currentReqs.includes(snippet.title)) {
      toast({
        title: "Already Requested",
        description:
          "This document has already been requested from this client.",
        variant: "destructive",
      });
      setIsRequestingDoc(false);
      return;
    }

    const newReqs = [...currentReqs, snippet.title];

    const { error } = await supabase
      .from("clients")
      .update({ requested_documents: newReqs })
      .eq("id", requestDocumentDialog.id);

    setIsRequestingDoc(false);

    if (!error) {
      setClients(
        clients.map((c) =>
          c.id === requestDocumentDialog.id
            ? { ...c, requested_documents: newReqs }
            : c,
        ),
      );
      toast({
        title: "Document Requested",
        description: `Requested ${snippet.title} from ${requestDocumentDialog.full_name}`,
      });
      setRequestDocumentDialog(null);
      setSelectedSnippetId("");
    } else {
      toast({
        title: "Error",
        description: "Failed to request document",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRequestedDocs = async (
    clientId: string,
    newReqs: string[],
  ) => {
    const { error } = await supabase
      .from("clients")
      .update({ requested_documents: newReqs })
      .eq("id", clientId);

    if (!error) {
      setClients(
        clients.map((c) =>
          c.id === clientId ? { ...c, requested_documents: newReqs } : c,
        ),
      );
      if (viewDocumentsDialog?.id === clientId) {
        setViewDocumentsDialog({
          ...viewDocumentsDialog,
          requested_documents: newReqs,
        });
      }
      toast({
        title: "Request Removed",
        description: "The document request has been canceled.",
      });
    }
  };

  // Render
  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Client Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Coordinate client workflows, documents, and credentials.
          </p>
        </div>
        <Dialog
          open={addClientDialogOpen}
          onOpenChange={setAddClientDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Onboard Client
            </Button>
          </DialogTrigger>
          <AddClientDialog
            companyId={companyId!}
            tracks={tracks}
            onSuccess={(newClient) => {
              setClients([newClient, ...clients]);
              setAddClientDialogOpen(false);
              toast({
                title: "Client Added",
                description: `${newClient.full_name} has been added and is pending onboarding`,
              });
            }}
          />
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabValue)}
      >
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {counts.pending}
            </span>
          </TabsTrigger>
          <TabsTrigger value="hired" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Hired
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {counts.hired}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <ClientList
            clients={filteredClients}
            emptyTitle="No pending reviews"
            emptyDescription="Clients completing onboarding will appear here"
            onViewCredentials={setViewCredentialsDialog}
            onViewDocuments={setViewDocumentsDialog}
            onFinalizeHire={setFinalizeHireDialog}
            onDeleteClient={handleDeleteClient}
            viewType="pending"
          />
        </TabsContent>

        <TabsContent value="hired" className="mt-6">
          <ClientList
            clients={filteredClients}
            emptyTitle="No hired clients"
            emptyDescription="Finalized hires will appear here"
            onViewCredentials={setViewCredentialsDialog}
            onViewDocuments={setViewDocumentsDialog}
            onRequestDocument={setRequestDocumentDialog}
            onResetPassword={handleResetPassword}
            onDeleteClient={handleDeleteClient}
            viewType="hired"
          />
        </TabsContent>
      </Tabs>

      {viewCredentialsDialog && (
        <Dialog
          open={!!viewCredentialsDialog}
          onOpenChange={() => setViewCredentialsDialog(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Credentials</DialogTitle>
              <DialogDescription>
                Access details for {viewCredentialsDialog.full_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Portal Login</Label>
                <div className="relative">
                  <pre className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap break-all">
                    {`Link: ${typeof window !== "undefined" ? window.location.origin : "https://onboardly.app"}
Username: ${viewCredentialsDialog.temp_username}
Password: ${viewCredentialsDialog.temp_password}`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 gap-2"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `Link: ${typeof window !== "undefined" ? window.location.origin : "https://onboardly.app"}
Username: ${viewCredentialsDialog.temp_username}
Password: ${viewCredentialsDialog.temp_password}`,
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                    Copy All
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {requestDocumentDialog && (
        <Dialog
          open={!!requestDocumentDialog}
          onOpenChange={() => {
            setRequestDocumentDialog(null);
            setSelectedSnippetId("");
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Document</DialogTitle>
              <DialogDescription>
                Select a document snippet to request from{" "}
                {requestDocumentDialog.full_name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {snippets.length > 0 ? (
                <div className="space-y-2">
                  <Label>Select Document Type</Label>
                  <Select
                    value={selectedSnippetId}
                    onValueChange={setSelectedSnippetId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a document..." />
                    </SelectTrigger>
                    <SelectContent>
                      {snippets.map((snippet) => (
                        <SelectItem key={snippet.id} value={snippet.id}>
                          {snippet.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>No document snippets available</p>
                  <p className="text-sm">
                    Create snippets in the Workflow Engine
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={handleSendDocumentRequest}
                disabled={!selectedSnippetId || isRequestingDoc}
              >
                {isRequestingDoc && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {viewDocumentsDialog && (
        <Dialog
          open={!!viewDocumentsDialog}
          onOpenChange={() => setViewDocumentsDialog(null)}
        >
          <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                Documents for {viewDocumentsDialog.full_name}
              </DialogTitle>
              <DialogDescription>
                Review track steps and requested documents
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 mt-4">
              <ViewDocumentsContent
                client={viewDocumentsDialog}
                onUpdateRequestedDocs={handleUpdateRequestedDocs}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {finalizeHireDialog && (
        <FinalizeHireModal
          client={finalizeHireDialog}
          onClose={() => setFinalizeHireDialog(null)}
          onSuccess={onHireSuccess}
        />
      )}
    </div>
  );
}

// Subcomponents
function ViewDocumentsContent({
  client,
  onUpdateRequestedDocs,
}: {
  client: ClientRecord;
  onUpdateRequestedDocs: (clientId: string, newReqs: string[]) => void;
}) {
  const supabase = createClient();
  const [steps, setSteps] = useState<WorkflowStepRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (client.assigned_track_id) {
        const { data: stepsData } = await supabase
          .from("workflow_steps")
          .select("*")
          .eq("track_id", client.assigned_track_id)
          .order("step_order", { ascending: true });

        if (stepsData) setSteps(stepsData);
      }

      const { data: docsData } = await supabase
        .from("client_documents")
        .select("*")
        .eq("client_id", client.id)
        .order("uploaded_at", { ascending: false });

      if (docsData) setDocuments(docsData);
      setLoading(false);
    };
    fetchData();
  }, [client.id, client.assigned_track_id, supabase]);

  const handleAccept = async (docId: string) => {
    const { error } = await supabase
      .from("client_documents")
      .update({ status: "accepted" })
      .eq("id", docId);
    if (!error) {
      setDocuments((docs) =>
        docs.map((d) => (d.id === docId ? { ...d, status: "accepted" } : d)),
      );
    }
  };

  const handleRequestChange = async (docId: string) => {
    const { error } = await supabase
      .from("client_documents")
      .update({ status: "pending" })
      .eq("id", docId);
    if (!error) {
      setDocuments((docs) =>
        docs.map((d) => (d.id === docId ? { ...d, status: "pending" } : d)),
      );
    }
  };

  const handleRemoveRequestedDoc = (title: string) => {
    const newReqs = (client.requested_documents || []).filter(
      (t) => t !== title,
    );
    onUpdateRequestedDocs(client.id, newReqs);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const requestedDocs = client.requested_documents || [];

  const trackDocs = steps.map((step) => ({
    title: step.title,
    doc: documents.find((d) => d.step_title === step.title),
  }));

  const adHocDocs = requestedDocs.map((title) => ({
    title,
    doc: documents.find((d) => d.step_title === title),
  }));

  const extraDocs = documents.filter(
    (d) =>
      !steps.some((s) => s.title === d.step_title) &&
      !requestedDocs.includes(d.step_title),
  );

  if (
    steps.length === 0 &&
    requestedDocs.length === 0 &&
    extraDocs.length === 0
  ) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4" />
        <p>No documents assigned or requested</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {trackDocs.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
            Onboarding Track
          </h3>
          {trackDocs.map(({ title, doc }, i) => (
            <DocumentRow
              key={`track-${i}`}
              title={title}
              doc={doc}
              onAccept={handleAccept}
              onRequestChange={handleRequestChange}
            />
          ))}
        </div>
      )}

      {(adHocDocs.length > 0 || extraDocs.length > 0) && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
            Documents
          </h3>
          {adHocDocs.map(({ title, doc }, i) => (
            <DocumentRow
              key={`adhoc-${i}`}
              title={title}
              doc={doc}
              onAccept={handleAccept}
              onRequestChange={handleRequestChange}
              onRemoveRequest={
                !doc ? () => handleRemoveRequestedDoc(title) : undefined
              }
            />
          ))}
          {extraDocs.map((doc) => (
            <DocumentRow
              key={`extra-${doc.id}`}
              title={doc.step_title}
              doc={doc}
              onAccept={handleAccept}
              onRequestChange={handleRequestChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FinalizeHireModal({
  client,
  onClose,
  onSuccess,
}: {
  client: ClientRecord;
  onClose: () => void;
  onSuccess: (id: string) => void;
}) {
  const supabase = createClient();
  const [steps, setSteps] = useState<WorkflowStepRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (client.assigned_track_id) {
        const { data: stepsData } = await supabase
          .from("workflow_steps")
          .select("*")
          .eq("track_id", client.assigned_track_id)
          .order("step_order", { ascending: true });

        if (stepsData) setSteps(stepsData);
      }

      const { data: docsData } = await supabase
        .from("client_documents")
        .select("*")
        .eq("client_id", client.id);

      if (docsData) setDocuments(docsData);
      setLoading(false);
    };
    fetchData();
  }, [client.id, client.assigned_track_id, supabase]);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const { error } = await supabase
      .from("clients")
      .update({ status: "hired", hired_at: new Date().toISOString() })
      .eq("id", client.id);

    setIsSubmitting(false);
    if (!error) {
      onSuccess(client.id);
    }
  };

  const trackStatus = steps.map((step) => {
    const doc = documents.find((d) => d.step_title === step.title);
    return { title: step.title, isAccepted: doc?.status === "accepted" };
  });

  const requestedStatus = (client.requested_documents || []).map((reqTitle) => {
    const doc = documents.find((d) => d.step_title === reqTitle);
    return { title: reqTitle, isAccepted: doc?.status === "accepted" };
  });

  const allTrackCompleted = trackStatus.every((s) => s.isAccepted);
  const allRequestedCompleted = requestedStatus.every((s) => s.isAccepted);
  const allCompleted =
    (trackStatus.length === 0 && requestedStatus.length === 0) ||
    (allTrackCompleted && allRequestedCompleted);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Finalize Hire Check</DialogTitle>
          <DialogDescription>
            Verify all documents are approved for {client.full_name}.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 my-4 pr-2">
            {trackStatus.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Onboarding Track
                </h4>
                {trackStatus.map((status, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                  >
                    {status.isAccepted ? (
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        status.isAccepted
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {status.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {requestedStatus.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Requested Documents
                </h4>
                {requestedStatus.map((status, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                  >
                    {status.isAccepted ? (
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        status.isAccepted
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {status.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {trackStatus.length === 0 && requestedStatus.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No requirements set for this client.</p>
              </div>
            )}

            {!allCompleted && (
              <div className="flex items-start gap-3 p-3 text-sm text-amber-800 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <p>
                  You cannot finalize this hire until all required documents
                  have been reviewed and accepted.
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!allCompleted || isSubmitting || loading}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Hire
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DocumentRow({
  title,
  doc,
  onAccept,
  onRequestChange,
  onRemoveRequest,
}: {
  title: string;
  doc?: DocumentRecord;
  onAccept: (id: string) => void;
  onRequestChange: (id: string) => void;
  onRemoveRequest?: () => void;
}) {
  if (!doc) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30 group">
        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">Pending submission</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
            Awaiting Upload
          </span>
          {onRemoveRequest && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={onRemoveRequest}
              title="Cancel Request"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground truncate">
          {doc.attachment_name}
        </p>
        <p className="text-xs text-muted-foreground">
          Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {doc.status === "accepted" && (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
            Accepted
          </span>
        )}
        {doc.status === "pending" && (
          <>
            <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium mr-2">
              Review Required
            </span>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onAccept(doc.id)}
            >
              <Check className="h-3.5 w-3.5" />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              onClick={() => onRequestChange(doc.id)}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Request Change
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function ClientList({
  clients,
  emptyTitle,
  emptyDescription,
  onViewCredentials,
  onViewDocuments,
  onRequestDocument,
  onFinalizeHire,
  onDeleteClient,
  onResetPassword,
  viewType,
}: {
  clients: ClientRecord[];
  emptyTitle: string;
  emptyDescription: string;
  onViewCredentials: (client: ClientRecord) => void;
  onViewDocuments: (client: ClientRecord) => void;
  onRequestDocument?: (client: ClientRecord) => void;
  onFinalizeHire?: (client: ClientRecord) => void;
  onDeleteClient?: (id: string) => void;
  onResetPassword?: (client: ClientRecord) => void;
  viewType: "pending" | "hired";
}) {
  if (clients.length === 0) {
    return (
      <Card className="border-border/50 border-dashed">
        <CardContent className="py-12 text-center">
          <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground">{emptyTitle}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {emptyDescription}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm">
                    {client.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <span className="font-medium">{client.full_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail className="h-3 w-3" />
                  {client.email}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium inline-flex items-center",
                    client.status === "hired" && "bg-green-100 text-green-700",
                    client.status === "pending" &&
                      "bg-amber-100 text-amber-700",
                  )}
                >
                  {client.status.charAt(0).toUpperCase() +
                    client.status.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {onFinalizeHire && client.status === "pending" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onFinalizeHire(client)}
                    >
                      Finalize Hire
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onViewCredentials(client)}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        View Credentials
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewDocuments(client)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Documents
                      </DropdownMenuItem>
                      {viewType === "hired" &&
                        onRequestDocument &&
                        onResetPassword && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onRequestDocument(client)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Request Document
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onResetPassword(client)}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                          </>
                        )}
                      {onDeleteClient && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteClient(client.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AddClientDialog({
  companyId,
  tracks,
  onSuccess,
}: {
  companyId: string;
  tracks: { id: string; name: string }[];
  onSuccess: (client: ClientRecord) => void;
}) {
  const supabase = createClient();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim()) return;
    setIsSubmitting(true);

    const password =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const username = email;

    const { data, error } = await supabase
      .from("clients")
      .insert([
        {
          company_id: companyId,
          full_name: fullName,
          email: email,
          status: "pending",
          assigned_track_id: selectedTrack || null,
          temp_username: username,
          temp_password: password,
          requested_documents: [],
        },
      ])
      .select()
      .single();

    setIsSubmitting(false);

    if (error || !data) {
      toast({
        title: "Error",
        description: "Failed to create client record.",
        variant: "destructive",
      });
      return;
    }

    setFullName("");
    setEmail("");
    setSelectedTrack("");
    onSuccess(data);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Onboard Client</DialogTitle>
        <DialogDescription>Add a client to onboard</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {tracks.length > 0 && (
          <div className="space-y-2">
            <Label>Assign Track</Label>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger>
                <SelectValue placeholder="Select an onboarding track..." />
              </SelectTrigger>
              <SelectContent>
                {tracks.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button
          onClick={handleSave}
          disabled={!fullName.trim() || !email.trim() || isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add to Onboarding
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

"use client";

// Imports
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTenant } from "@/lib/providers/tenant-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Shield,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
  Save,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Types
type RolePermissions = {
  pipeline: boolean;
  workflow: boolean;
  people: boolean;
  vault: boolean;
  settings: boolean;
  team: boolean;
};

type CompanyRole = {
  id: string;
  name: string;
  description: string;
  permissions: RolePermissions;
};

// Main Component
export function TeamTab() {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const supabase = createClient();

  const [members, setMembers] = useState<any[]>([]);
  const [roles, setRoles] = useState<CompanyRole[]>([]);
  const [hiredClients, setHiredClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CompanyRole | null>(null);

  // Fetch functions
  const fetchData = async () => {
    if (!tenant) return;
    setLoading(true);

    const [membersRes, rolesRes, clientsRes] = await Promise.all([
      supabase
        .from("team_members")
        .select("*, user:user_id(email, raw_user_meta_data)")
        .eq("company_id", tenant.id),
      supabase
        .from("company_roles")
        .select("*")
        .eq("company_id", tenant.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("clients")
        .select("id, full_name, email")
        .eq("company_id", tenant.id)
        .eq("status", "hired"),
    ]);

    if (membersRes.data) setMembers(membersRes.data);
    if (rolesRes.data) setRoles(rolesRes.data);
    if (clientsRes.data) setHiredClients(clientsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [tenant]);

  // Handlers
  const handleDeleteRole = async (id: string) => {
    const { error } = await supabase
      .from("company_roles")
      .delete()
      .eq("id", id);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setRoles(roles.filter((r) => r.id !== id));
    toast({ title: "Role deleted" });
  };

  const handleRemoveMember = async (memberId: string) => {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setMembers(members.filter((m) => m.id !== memberId));
    toast({ title: "Access revoked" });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Role Builder Section */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" /> Role Builder
            </CardTitle>
            <CardDescription>
              Customize specific permissions for your organization
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setEditingRole(null);
              setRoleDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> New Role
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No custom roles defined.
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {role.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(role.permissions || {}).map(
                            ([key, val]) =>
                              val && (
                                <Badge
                                  key={key}
                                  variant="secondary"
                                  className="text-[10px] capitalize font-normal"
                                >
                                  {key}
                                </Badge>
                              ),
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingRole(role);
                                setRoleDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Staff Directory Section */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Staff Directory</CardTitle>
            <CardDescription>
              Manage active team members and their roles
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => setAddMemberDialogOpen(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" /> Add Staff
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-border"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                  {
                    (m.user?.raw_user_meta_data?.full_name ||
                      m.user?.raw_user_meta_data?.fullName ||
                      "?")[0]
                  }
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {m.user?.raw_user_meta_data?.full_name ||
                      m.user?.raw_user_meta_data?.fullName ||
                      "Unknown Member"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" /> {m.user?.email}
                    <span className="mx-1">•</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 capitalize"
                    >
                      {m.role}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleRemoveMember(m.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Revoke Access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <RoleDialog
          role={editingRole}
          companyId={tenant?.id}
          onSave={() => {
            setRoleDialogOpen(false);
            fetchData();
          }}
          close={() => setRoleDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <AddMemberDialog
          companyId={tenant?.id}
          roles={roles}
          hiredClients={hiredClients}
          onSave={() => {
            setAddMemberDialogOpen(false);
            fetchData();
          }}
          close={() => setAddMemberDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
}

// Add Member Dialog
function AddMemberDialog({
  companyId,
  roles,
  hiredClients,
  onSave,
  close,
}: any) {
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState("");

  const filteredClients = hiredClients.filter(
    (c: any) =>
      (c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())) &&
      c.id !== selectedClient?.id,
  );

  // Function to insert into team_members
  const handleAdd = async () => {
    if (!selectedClient || !selectedRole || !companyId) return;
    setLoading(true);

    const { error } = await supabase.from("team_members").insert({
      company_id: companyId,
      user_id: selectedClient.id,
      role: selectedRole,
    });

    if (error) {
      toast({
        title: "Database Error",
        description: error.message.includes("foreign key")
          ? "This client does not have a linked Auth account. Only clients with valid portal accounts can be promoted."
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Staff member added successfully" });
      onSave();
    }
    setLoading(false);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogDescription>
          Search for a hired candidate to add to your staff
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        {selectedClient ? (
          <div className="flex items-center justify-between p-3 rounded-lg border border-primary bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {selectedClient.full_name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {selectedClient.full_name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {selectedClient.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setSelectedClient(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Search Member</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Find hired candidate..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {search && filteredClients.length > 0 && (
              <div className="border rounded-md max-h-[160px] overflow-y-auto mt-1 divide-y bg-card">
                {filteredClients.map((c: any) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 p-2 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedClient(c);
                      setSearch("");
                    }}
                  >
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold uppercase">
                      {c.full_name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">
                        {c.full_name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {c.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label>Assign Organization Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a custom role..." />
            </SelectTrigger>
            <SelectContent>
              {roles.length === 0 ? (
                <p className="p-4 text-xs text-center text-muted-foreground italic">
                  No custom roles found. Create one in the Role Builder.
                </p>
              ) : (
                roles.map((r: any) => (
                  <SelectItem key={r.id} value={r.name}>
                    {r.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          disabled={loading || !selectedClient || !selectedRole}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add to Staff
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// Role Builder Dialog
function RoleDialog({ role, companyId, onSave, close }: any) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [permissions, setPermissions] = useState<RolePermissions>(
    role?.permissions || {
      pipeline: false,
      workflow: false,
      people: false,
      vault: false,
      settings: false,
      team: false,
    },
  );

  const permissionLabels: Record<string, string> = {
    pipeline: "Dashboard Access",
    workflow: "Workflow Management",
    people: "Client Management",
    vault: "Document Repository",
    settings: "Workspace Settings",
    team: "Team Management",
  };

  const handleSave = async () => {
    if (!name || !companyId) return;
    setLoading(true);
    const payload = { company_id: companyId, name, description, permissions };
    const { error } = role
      ? await supabase.from("company_roles").update(payload).eq("id", role.id)
      : await supabase.from("company_roles").insert(payload);

    if (!error) onSave();
    setLoading(false);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{role ? "Edit Role" : "Create New Role"}</DialogTitle>
        <DialogDescription>
          Define what this role can see and do
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label>Role Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Recruiter"
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this role handles..."
          />
        </div>
        <div className="space-y-3 pt-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Permissions
          </Label>
          <div className="space-y-2">
            {Object.keys(permissions).map((key) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
              >
                <p className="text-sm font-medium capitalize">
                  {permissionLabels[key] || key}
                </p>
                <Switch
                  checked={(permissions as any)[key]}
                  onCheckedChange={(checked) =>
                    setPermissions({ ...permissions, [key]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {role ? "Update Role" : "Save Role"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore, type Role, type TeamMember } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Building2,
  Palette,
  Users,
  Shield,
  Plus,
  Upload,
  MoreVertical,
  Trash2,
  Edit,
  Mail,
  Lock,
  Save,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsModule() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings Hub</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, organization, and team settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="organization" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Organization</span>
          </TabsTrigger>
          <TabsTrigger value="brand" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Brand Identity</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team Roles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="organization" className="mt-6">
          <OrganizationTab />
        </TabsContent>
        <TabsContent value="brand" className="mt-6">
          <BrandTab />
        </TabsContent>
        <TabsContent value="team" className="mt-6">
          <TeamTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileTab() {
  const { user, setUser } = useAppStore();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (user) {
      setUser({ ...user, fullName, email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold">
              {fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="gap-2">
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div />
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
          <Button variant="outline">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function OrganizationTab() {
  const { tenant, updateTenant } = useAppStore();
  const [companyName, setCompanyName] = useState(tenant?.companyName || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateTenant({ companyName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Organization Details</CardTitle>
        <CardDescription>Manage your organization settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Workspace URL</Label>
            <Input
              value={tenant?.workspaceUrl || ""}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2">
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function BrandTab() {
  const { tenant, updateTenant } = useAppStore();
  const [primaryColor, setPrimaryColor] = useState(
    tenant?.primaryColor || "#6366f1",
  );
  const [secondaryColor, setSecondaryColor] = useState(
    tenant?.secondaryColor || "#22c55e",
  );
  const [logo, setLogo] = useState(tenant?.logo || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (tenant) {
      setPrimaryColor(tenant.primaryColor);
      setSecondaryColor(tenant.secondaryColor);
      setLogo(tenant.logo || "");
    }
  }, [tenant]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateTenant({ primaryColor, secondaryColor, logo: logo || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Brand Identity</CardTitle>
          <CardDescription>Customize your brand appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
            >
              {logo ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={logo}
                    alt="Company logo"
                    className="h-16 w-16 object-contain rounded"
                  />
                  <p className="text-sm text-muted-foreground">
                    Click to change
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload logo</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-20 rounded cursor-pointer border border-border"
              />
              <span className="text-sm font-mono text-muted-foreground uppercase">
                {primaryColor}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-10 w-20 rounded cursor-pointer border border-border"
              />
              <span className="text-sm font-mono text-muted-foreground uppercase">
                {secondaryColor}
              </span>
            </div>
          </div>

          <Button onClick={handleSave} className="gap-2">
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
          <CardDescription>See how your brand looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="rounded-lg border border-border p-4 space-y-4"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}10 0%, ${secondaryColor}10 100%)`,
            }}
          >
            <div className="flex items-center gap-3">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="h-10 w-10 rounded object-contain"
                />
              ) : (
                <div
                  className="h-10 w-10 rounded flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: primaryColor }}
                >
                  {tenant?.companyName?.[0] || "O"}
                </div>
              )}
              <div>
                <p className="font-medium text-foreground">
                  {tenant?.companyName || "Your Company"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tenant?.workspaceUrl}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                className="w-full py-2 px-4 rounded-md text-white text-sm font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                Primary Action
              </button>
              <button
                className="w-full py-2 px-4 rounded-md text-white text-sm font-medium"
                style={{ backgroundColor: secondaryColor }}
              >
                Secondary Action
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamTab() {
  const {
    teamMembers,
    roles,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    addRole,
    updateRole,
  } = useAppStore();

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Staff Directory</CardTitle>
              <CardDescription>
                Manage team members and their roles
              </CardDescription>
            </div>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <InviteMemberDialog
                roles={roles}
                onSave={(member) => {
                  addTeamMember(member);
                  setInviteDialogOpen(false);
                }}
              />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-border"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{member.name}</p>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        member.status === "active" &&
                          "bg-green-100 text-green-700",
                        member.status === "invited" &&
                          "bg-amber-100 text-amber-700",
                        member.status === "inactive" &&
                          "bg-gray-100 text-gray-700",
                      )}
                    >
                      {member.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {member.email}
                    <span className="text-muted-foreground">•</span>
                    {member.role}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => removeTeamMember(member.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Builder
              </CardTitle>
              <CardDescription>Define roles and permissions</CardDescription>
            </div>
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Role
                </Button>
              </DialogTrigger>
              <RoleDialog
                onSave={(roleData) => {
                  addRole(roleData as Role);
                  setRoleDialogOpen(false);
                }}
              />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="p-4 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{role.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingRole(role)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(role.permissions).map(([key, value]) => (
                    <span
                      key={key}
                      className={cn(
                        "text-xs px-2 py-1 rounded",
                        value
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500",
                      )}
                    >
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingRole && (
        <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
          <RoleDialog
            role={editingRole}
            onSave={(updates) => {
              updateRole(editingRole.id, updates as Partial<Role>);
              setEditingRole(null);
            }}
          />
        </Dialog>
      )}
    </div>
  );
}

function InviteMemberDialog({
  roles,
  onSave,
}: {
  roles: Role[];
  onSave: (member: TeamMember) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSave = () => {
    if (!name.trim() || !email.trim() || !role) return;
    onSave({
      id: Date.now().toString(),
      name,
      email,
      role,
      status: "invited",
    });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogDescription>
          Send an invitation to join your team
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role..." />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.name}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={handleSave}
          disabled={!name.trim() || !email.trim() || !role}
        >
          Send Invitation
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function RoleDialog({
  role,
  onSave,
}: {
  role?: Role;
  onSave: (role: Role | Partial<Role>) => void;
}) {
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [permissions, setPermissions] = useState<Record<string, boolean>>(
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
    pipeline: "Pipeline - View dashboard and metrics",
    workflow: "Workflow Engine - Manage tracks and snippets",
    people: "People & Directory - Manage clients",
    vault: "The Vault - Access documents",
    settings: "Settings - Modify organization settings",
    team: "Team - Manage team members and roles",
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (role) {
      onSave({ name, description, permissions });
    } else {
      onSave({
        id: Date.now().toString(),
        name,
        description,
        permissions,
      });
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
        <DialogDescription>
          {role
            ? "Update role permissions"
            : "Define a new role with specific permissions"}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roleName">Role Name</Label>
          <Input
            id="roleName"
            placeholder="e.g., HR Manager"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roleDesc">Description</Label>
          <Input
            id="roleDesc"
            placeholder="Brief description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <Label>Permissions</Label>
          {Object.entries(permissions).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div>
                <p className="font-medium text-sm capitalize">{key}</p>
                <p className="text-xs text-muted-foreground">
                  {permissionLabels[key]?.split(" - ")[1]}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) =>
                  setPermissions({ ...permissions, [key]: checked })
                }
              />
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSave} disabled={!name.trim()}>
          {role ? "Save Changes" : "Create Role"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

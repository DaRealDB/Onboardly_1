// app/admin/tenants/page.tsx
"use client";

import { useAdminTenants } from "@/lib/hooks/use-admin";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Settings, Trash2 } from "lucide-react";

export default function AdminTenantsPage() {
  const { tenants, isLoading, updateTenantPlan, deleteTenant } =
    useAdminTenants();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Pipelines</h2>
        <p className="text-sm text-muted-foreground">
          Manage hiring flows across all company domains
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Domain</TableHead>
              <TableHead>Clients</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-mono font-medium">
                  {tenant.slug}
                </TableCell>
                <TableCell>{tenant.clientCount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {tenant.plan}
                  </Badge>
                </TableCell>
                <TableCell>{tenant.documentCount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

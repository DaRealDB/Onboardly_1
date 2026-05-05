"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./auth-provider";
import type { TeamRole } from "@/lib/types/database";
import { hasPermission, ROLE_PERMISSIONS } from "@/lib/hooks/use-team";

interface RefreshOptions {
  isNewWorkspace?: boolean;
}

interface TenantContextType {
  tenant: any | null;
  tenants: any[];
  currentRole: TeamRole | null;
  isLoading: boolean;
  stats: any | null;
  isImpersonating: boolean;
  impersonatedBy: string | null;
  setCurrentTenant: (tenant: any) => void;
  refreshTenants: (options?: RefreshOptions) => Promise<void>;
  createTenant: (
    data: any,
  ) => Promise<{ data: any | null; error: string | null }>;
  updateTenant: (id: string, data: any) => Promise<{ error: string | null }>;
  can: (permission: string) => boolean;
  startImpersonation: (tenantId: string, adminEmail: string) => void;
  stopImpersonation: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<any | null>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedBy, setImpersonatedBy] = useState<string | null>(null);
  const { user, isSuperAdmin } = useAuth();
  const supabase = createClient();

  const fetchTenants = useCallback(async (): Promise<any[]> => {
    if (!user) {
      setTenants([]);
      setTenant(null);
      setIsLoading(false);
      return [];
    }

    setIsLoading(true);

    // UPDATED: Query companies instead of tenants
    const { data: memberData, error: memberError } = await supabase
      .from("team_members")
      .select(
        `
        role,
        company:companies (*) 
      `,
      )
      .eq("user_id", user.id);

    if (memberError) {
      console.error(
        "Supabase Company Error:",
        memberError?.message,
        memberError?.details,
        memberError?.hint,
        memberError?.code,
      );
      setIsLoading(false);
      return [];
    }

    // Map the new company data back into the old "tenant" format so the UI doesn't crash
    const tenantsWithRoles: any[] = (memberData || [])
      .filter((item: any) => item.company)
      .map((item: any) => ({
        ...item.company,
        role: item.role as TeamRole,
      }))
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

    setTenants(tenantsWithRoles);

    setTenant((prev: any) => {
      if (tenantsWithRoles.length === 0) return null;
      if (!prev || !tenantsWithRoles.find((t) => t.id === prev.id)) {
        return tenantsWithRoles[0];
      }
      return prev;
    });

    setIsLoading(false);
    return tenantsWithRoles;
  }, [user, supabase]);

  const fetchStats = useCallback(async () => {
    if (!tenant) {
      setStats(null);
      return;
    }

    // NOTE: The clients table was dropped!
    // Returning null for now to prevent the app from crashing until you build the new feature.
    setStats({
      totalClients: 0,
      activeClients: 0,
      completedClients: 0,
      averageCompletionTime: 0,
      completionRate: 0,
    });
  }, [tenant, supabase]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  // Realtime subscription for team_members changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("team_members_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "team_members",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTenants();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "team_members",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTenants();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, fetchTenants]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const setCurrentTenant = (newTenant: any) => {
    setTenant(newTenant);
  };

  const refreshTenants = async (options: RefreshOptions = {}) => {
    const { isNewWorkspace = false } = options;

    if (isNewWorkspace) {
      await new Promise((res) => setTimeout(res, 500));
    }

    const result = await fetchTenants();

    if (isNewWorkspace && result.length === 0) {
      await new Promise((res) => setTimeout(res, 1000));
      await fetchTenants();
    }
  };

  const createTenant = async (data: any) => {
    if (!user) {
      return { data: null, error: "Not authenticated" };
    }

    // UPDATED: Insert into companies
    const { data: newTenant, error } = await supabase
      .from("companies")
      .insert({
        ...data,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    await fetchTenants();
    return { data: newTenant, error: null };
  };

  const updateTenant = async (id: string, data: any) => {
    // UPDATED: Update companies
    const { error } = await supabase
      .from("companies")
      .update(data)
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    await fetchTenants();
    return { error: null };
  };

  const can = useCallback(
    (permission: string): boolean => {
      if (isSuperAdmin) return true;
      if (isImpersonating) return true;
      return hasPermission(tenant?.role, permission);
    },
    [tenant?.role, isSuperAdmin, isImpersonating],
  );

  const startImpersonation = async (tenantId: string, adminEmail: string) => {
    if (!isSuperAdmin) return;

    // UPDATED: Query companies
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", tenantId)
      .single();

    if (!error && data) {
      setTenant({ ...data, role: "owner" as TeamRole });
      setIsImpersonating(true);
      setImpersonatedBy(adminEmail);
    }
  };

  const stopImpersonation = () => {
    setIsImpersonating(false);
    setImpersonatedBy(null);
    fetchTenants();
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        tenants,
        currentRole: tenant?.role || null,
        isLoading,
        stats,
        isImpersonating,
        impersonatedBy,
        setCurrentTenant,
        refreshTenants,
        createTenant,
        updateTenant,
        can,
        startImpersonation,
        stopImpersonation,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

'use client'

import { useAppStore, type DashboardModule } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  GitBranch,
  Users,
  FolderLock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems: { id: DashboardModule; label: string; icon: React.ElementType }[] = [
  { id: 'pipeline', label: 'Pipeline', icon: LayoutDashboard },
  { id: 'workflow', label: 'Workflow Engine', icon: GitBranch },
  { id: 'people', label: 'People & Directory', icon: Users },
  { id: 'vault', label: 'The Vault', icon: FolderLock },
]

export function Sidebar() {
  const { currentModule, setCurrentModule, sidebarCollapsed, toggleSidebar, tenant } =
    useAppStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-40',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            {tenant?.logo ? (
              <img
                src={tenant.logo}
                alt="Logo"
                className="h-8 w-8 rounded object-contain"
              />
            ) : (
              <div
                className="h-8 w-8 rounded flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: tenant?.primaryColor || '#6366f1' }}
              >
                {tenant?.companyName?.[0] || 'O'}
              </div>
            )}
            <span className="font-semibold text-sidebar-foreground truncate">
              {tenant?.companyName || 'Onboardly'}
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-muted hover:text-sidebar-foreground',
            sidebarCollapsed && 'mx-auto'
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentModule === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentModule(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-muted">
            <p className="font-medium text-sidebar-foreground">{tenant?.companyName}</p>
            <p className="truncate">{tenant?.workspaceUrl}</p>
          </div>
        </div>
      )}
    </aside>
  )
}

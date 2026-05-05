'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, ArrowLeft, ArrowRight, Check } from 'lucide-react'

const presetColors = [
  { name: 'Indigo', primary: '#6366f1', secondary: '#22c55e' },
  { name: 'Blue', primary: '#3b82f6', secondary: '#f59e0b' },
  { name: 'Emerald', primary: '#10b981', secondary: '#8b5cf6' },
  { name: 'Rose', primary: '#f43f5e', secondary: '#06b6d4' },
  { name: 'Amber', primary: '#f59e0b', secondary: '#6366f1' },
]

export function ThemeStep() {
  const { setCurrentView, tenant, updateTenant } = useAppStore()
  const [primaryColor, setPrimaryColor] = useState(tenant?.primaryColor || '#6366f1')
  const [secondaryColor, setSecondaryColor] = useState(tenant?.secondaryColor || '#22c55e')

  useEffect(() => {
    updateTenant({ primaryColor, secondaryColor })
  }, [primaryColor, secondaryColor, updateTenant])

  const handleBack = () => {
    setCurrentView('wizard-identity')
  }

  const handleContinue = () => {
    setCurrentView('wizard-logic')
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Brand Theme
        </CardTitle>
        <CardDescription>
          Customize the look and feel of your tenant portal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
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

            <div className="space-y-2 pt-2">
              <Label>Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setPrimaryColor(preset.primary)
                      setSecondaryColor(preset.secondary)
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <span className="text-xs">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Live Preview</Label>
            <div
              className="rounded-lg border border-border p-4 space-y-4"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}10 0%, ${secondaryColor}10 100%)`,
              }}
            >
              <div className="flex items-center gap-3">
                {tenant?.logo ? (
                  <img
                    src={tenant.logo}
                    alt="Logo"
                    className="h-10 w-10 rounded object-contain"
                  />
                ) : (
                  <div
                    className="h-10 w-10 rounded flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {tenant?.companyName?.[0] || 'A'}
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {tenant?.companyName || 'Your Company'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tenant?.workspaceUrl || 'your-company.onboardly.com'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  className="w-full py-2 px-4 rounded-md text-white text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary Button
                </button>
                <button
                  className="w-full py-2 px-4 rounded-md text-white text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: secondaryColor }}
                >
                  Secondary Button
                </button>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-md bg-card border border-border">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Check className="h-4 w-4" style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Task Completed</p>
                  <p className="text-xs text-muted-foreground">Onboarding step finished</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-between">
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleContinue} className="gap-2">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

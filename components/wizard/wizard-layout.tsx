'use client'

import { useAppStore, type AppView } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const steps = [
  { id: 'wizard-identity' as AppView, label: 'Identity', number: 1 },
  { id: 'wizard-theme' as AppView, label: 'Theme', number: 2 },
  { id: 'wizard-logic' as AppView, label: 'Logic', number: 3 },
]

interface WizardLayoutProps {
  children: React.ReactNode
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const currentView = useAppStore((state) => state.currentView)
  
  const currentStepIndex = steps.findIndex((s) => s.id === currentView)
  
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Set Up Your Workspace</h1>
            <p className="text-muted-foreground mt-1">Configure your tenant in 3 simple steps</p>
          </div>
          
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                      index < currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : index === currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={cn(
                      'ml-2 text-sm font-medium',
                      index <= currentStepIndex
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-16 h-0.5 mx-4',
                      index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}

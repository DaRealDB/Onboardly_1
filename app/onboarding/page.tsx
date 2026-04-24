'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/providers/auth-provider'
import { Building2, Users, Briefcase, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { provisionWorkspace } from '@/lib/actions/workspace'
import type { IndustryType } from '@/lib/types/database'

const steps = [
  { id: 1, title: 'Organization', icon: Building2 },
  { id: 2, title: 'Industry', icon: Briefcase },
  { id: 3, title: 'Team Size', icon: Users },
  { id: 4, title: 'Complete', icon: CheckCircle2 },
]

const industries = [
  { value: 'legal', label: 'Legal' },
  { value: 'creative', label: 'Creative & Marketing' },
  { value: 'financial', label: 'Finance & Consulting' },
  { value: 'general', label: 'General / Other' },
]

const teamSizes = [
  { value: '1-5', label: '1-5 employees' },
  { value: '6-20', label: '6-20 employees' },
  { value: '21-50', label: '21-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: '',
    slug: '',
    industry: '',
    teamSize: '',
  })

  const progress = (currentStep / steps.length) * 100

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50)
  }

  const handleOrganizationNameChange = (value: string) => {
    setFormData({
      ...formData,
      organizationName: value,
      slug: generateSlug(value),
    })
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (!user) {
      toast.error('Please sign in to continue')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await provisionWorkspace({
        name: formData.organizationName,
        slug: formData.slug,
        industry: (formData.industry || 'general') as IndustryType,
        default_logic_mode: 'strict',
      })

      if (!result.success) {
        toast.error('Failed to create organization', {
          description: result.error,
        })
        return
      }

      toast.success('Organization created!', {
        description: 'Your workspace is ready with starter templates.',
      })

      // Small delay to show success message
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error creating organization. Please try again.'
      toast.error('Failed to create organization', {
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.organizationName.length >= 2 && formData.slug.length >= 2
      case 2:
        return formData.industry !== ''
      case 3:
        return formData.teamSize !== ''
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isComplete = step.id < currentStep
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    isActive ? 'text-primary' : isComplete ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isComplete
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              )
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Create your organization</CardTitle>
                <CardDescription>
                  Let&apos;s start by setting up your organization in Onboardly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={formData.organizationName}
                    onChange={(e) => handleOrganizationNameChange(e.target.value)}
                    placeholder="Acme Inc."
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      onboardly.app/
                    </span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: generateSlug(e.target.value) })
                      }
                      placeholder="acme"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will be your unique URL for the client portal
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>What industry are you in?</CardTitle>
                <CardDescription>
                  This helps us customize your onboarding templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle>How big is your team?</CardTitle>
                <CardDescription>
                  This helps us recommend the right plan for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {teamSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setFormData({ ...formData, teamSize: size.value })}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        formData.teamSize === size.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">{size.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 4 && (
            <>
              <CardHeader>
                <CardTitle>You&apos;re all set!</CardTitle>
                <CardDescription>
                  Your organization is ready to go
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium mb-2">Organization Summary</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Name</dt>
                        <dd className="font-medium">{formData.organizationName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">URL</dt>
                        <dd className="font-medium">onboardly.app/{formData.slug}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Industry</dt>
                        <dd className="font-medium">
                          {industries.find(i => i.value === formData.industry)?.label || formData.industry}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Team Size</dt>
                        <dd className="font-medium">
                          {teamSizes.find(t => t.value === formData.teamSize)?.label || formData.teamSize}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">14-day free trial activated</p>
                      <p className="text-xs text-muted-foreground">
                        No credit card required. Upgrade anytime.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          <CardFooter className="flex justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < steps.length ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Get Started'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Skip link */}
        {currentStep < 4 && (
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Already have an organization?{' '}
            <button
              onClick={() => router.push('/dashboard')}
              className="text-primary hover:underline"
            >
              Go to dashboard
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

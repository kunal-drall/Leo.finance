"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Wallet,
  ArrowRight,
  ArrowLeft,
  Check,
  DollarSign,
  Users,
  Calendar,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateCircleFormData } from "@/types/circle";
import { formatCurrency } from "@/lib/utils";

/**
 * Circle Creation Flow
 * Multi-step wizard optimized for mobile
 */
export default function CreateCirclePage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateCircleFormData>({
    name: "",
    description: "",
    contributionAmount: "",
    contributionFrequency: 30, // days
    maxMembers: 10,
    isPrivate: false,
  });

  const totalSteps = 4;

  // Show connect wallet prompt if not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-4 text-2xl font-bold md:text-3xl">
            Connect Your Wallet
          </h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            Connect your wallet to create a new savings circle.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  const updateFormData = (field: keyof CreateCircleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement contract interaction
    console.log("Creating circle with data:", formData);

    // For now, just redirect to dashboard
    router.push("/dashboard");
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.contributionAmount.length > 0 && parseFloat(formData.contributionAmount) > 0;
      case 3:
        return formData.maxMembers >= 2 && formData.maxMembers <= 50;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Create New Circle</h1>
        <p className="mt-1 text-muted-foreground">
          Set up your savings circle in a few simple steps
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium">Step {step} of {totalSteps}</span>
          <span className="text-muted-foreground">{Math.round((step / totalSteps) * 100)}% complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {step === 1 && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                Circle Details
              </>
            )}
            {step === 2 && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                  <DollarSign className="h-5 w-5 text-secondary" />
                </div>
                Contribution Amount
              </>
            )}
            {step === 3 && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Calendar className="h-5 w-5 text-success" />
                </div>
                Circle Settings
              </>
            )}
            {step === 4 && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                Review & Create
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Circle Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Circle Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Monthly Savers Club"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  Choose a memorable name for your circle
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell others about your savings goals..."
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  maxLength={200}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/200 characters
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Contribution Amount */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Contribution Amount (PYUSD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100.00"
                    value={formData.contributionAmount}
                    onChange={(e) => updateFormData("contributionAmount", e.target.value)}
                    className="pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  The amount each member contributes per round
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Contribution Frequency *</Label>
                <select
                  id="frequency"
                  className="flex h-12 w-full rounded-lg border border-border bg-background px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={formData.contributionFrequency}
                  onChange={(e) => updateFormData("contributionFrequency", Number(e.target.value))}
                >
                  <option value={7}>Weekly</option>
                  <option value={14}>Bi-weekly</option>
                  <option value={30}>Monthly</option>
                  <option value={90}>Quarterly</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  How often members contribute
                </p>
              </div>

              {formData.contributionAmount && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Per contribution:</span>
                        <span className="font-semibold">
                          {formatCurrency(parseFloat(formData.contributionAmount), "USD")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="font-semibold">
                          {formData.contributionFrequency === 7 && "Weekly"}
                          {formData.contributionFrequency === 14 && "Bi-weekly"}
                          {formData.contributionFrequency === 30 && "Monthly"}
                          {formData.contributionFrequency === 90 && "Quarterly"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Circle Settings */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxMembers">Maximum Members *</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  placeholder="10"
                  value={formData.maxMembers}
                  onChange={(e) => updateFormData("maxMembers", Number(e.target.value))}
                  min="2"
                  max="50"
                />
                <p className="text-xs text-muted-foreground">
                  Between 2 and 50 members (recommended: 5-15)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Privacy</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateFormData("isPrivate", false)}
                    className={`flex-1 rounded-lg border-2 p-4 text-left transition-colors ${
                      !formData.isPrivate
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="mb-2 font-semibold">Public</div>
                    <div className="text-sm text-muted-foreground">
                      Anyone can discover and join
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFormData("isPrivate", true)}
                    className={`flex-1 rounded-lg border-2 p-4 text-left transition-colors ${
                      formData.isPrivate
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 font-semibold">
                      <Lock className="h-4 w-4" />
                      Private
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Invite-only circle
                    </div>
                  </button>
                </div>
              </div>

              {formData.maxMembers >= 2 && formData.contributionAmount && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total pool size:</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            parseFloat(formData.contributionAmount) * formData.maxMembers,
                            "USD"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Circle duration:</span>
                        <span className="font-semibold">
                          {formData.maxMembers} rounds
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="rounded-lg border border-border p-6 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Circle Name</div>
                  <div className="font-semibold text-lg">{formData.name}</div>
                </div>

                {formData.description && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Description</div>
                    <div className="text-sm">{formData.description}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Contribution</div>
                    <div className="font-semibold">
                      {formatCurrency(parseFloat(formData.contributionAmount), "USD")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Frequency</div>
                    <div className="font-semibold">
                      {formData.contributionFrequency === 7 && "Weekly"}
                      {formData.contributionFrequency === 14 && "Bi-weekly"}
                      {formData.contributionFrequency === 30 && "Monthly"}
                      {formData.contributionFrequency === 90 && "Quarterly"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Max Members</div>
                    <div className="font-semibold">{formData.maxMembers}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Privacy</div>
                    <div className="font-semibold">
                      {formData.isPrivate ? (
                        <Badge variant="outline">
                          <Lock className="mr-1 h-3 w-3" />
                          Private
                        </Badge>
                      ) : (
                        <Badge variant="outline">Public</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-semibold">
                      <span>Total Pool Size:</span>
                      <span className="text-primary text-lg">
                        {formatCurrency(
                          parseFloat(formData.contributionAmount) * formData.maxMembers,
                          "USD"
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Each member will receive this amount when it's their turn
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="mt-6 flex gap-3">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={handleBack}
            size="lg"
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!isStepValid()}
          size="lg"
          className="flex-1"
        >
          {step === totalSteps ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Create Circle
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

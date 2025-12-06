"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Shield,
  CheckCircle2,
  Loader2,
  Sparkles,
  Crown,
  Infinity,
} from "lucide-react";

interface PremiumStatus {
  isPremium: boolean;
  premiumSince: string | null;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const token = localStorage.getItem("bearer_token");
        
        const response = await fetch("/api/subscription/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch premium status");
        const data = await response.json();
        setPremiumStatus(data);
      } catch (err) {
        setError("Failed to load payment details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPremiumStatus();
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("bearer_token");

      // Simulate payment processing with dummy card
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Activate premium subscription
      const response = await fetch("/api/subscription/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: 29.99,
          currency: "USD",
        }),
      });

      if (!response.ok) throw new Error("Payment failed");

      // Success! Redirect to dashboard
      router.push("/dashboard?premium=activated");
    } catch (err) {
      setError("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (premiumStatus?.isPremium) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-primary">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">You&apos;re Already Premium!</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Premium member since {new Date(premiumStatus.premiumSince || "").toLocaleDateString("en-US", { 
                month: "long", 
                day: "numeric",
                year: "numeric" 
              })}
            </p>
            <p className="text-muted-foreground mb-6">
              You have unlimited lifetime access to all detailed feedback reports.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Unlimited Reports
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Infinity className="w-3 h-3" />
                Lifetime Access
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                All Features
              </Badge>
            </div>
            <Link href="/dashboard">
              <Button size="lg">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Upgrade to Premium</h1>
            <p className="text-muted-foreground">One-time payment • Lifetime access</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Order Summary */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Premium Subscription
            </CardTitle>
            <CardDescription>Unlock all detailed feedback reports forever</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-2xl font-bold">
                <span>One-Time Payment</span>
                <span className="text-primary">$29.99</span>
              </div>
              <Separator />
              <ul className="space-y-3">
                {[
                  "Unlimited detailed feedback reports",
                  "Access to all past and future evaluations",
                  "Comprehensive code analysis",
                  "Specific improvement recommendations",
                  "Performance optimization tips",
                  "Lifetime access - pay once, benefit forever",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Value Proposition */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Why Go Premium?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Infinity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Unlimited Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Get detailed feedback for every task you submit - no per-report charges.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Better Than $4.99 Per Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Pay once and unlock all reports. Break even after just 6 evaluations.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Lifetime Guarantee</h4>
                  <p className="text-sm text-muted-foreground">
                    Your premium access never expires. One payment, forever premium.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Demo mode - Use test card: 4242 4242 4242 4242
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="card">Card Number</Label>
              <Input
                id="card"
                placeholder="4242 4242 4242 4242"
                disabled={isProcessing}
                defaultValue="4242 4242 4242 4242"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" disabled={isProcessing} defaultValue="12/25" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" disabled={isProcessing} defaultValue="123" />
              </div>
            </div>

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  Activate Premium for $29.99
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Secure payment • 30-day money-back guarantee</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
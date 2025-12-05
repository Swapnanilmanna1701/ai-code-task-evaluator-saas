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
  FileCode,
} from "lucide-react";

interface Evaluation {
  id: number;
  taskId: number;
  score: number | null;
  isPremiumUnlocked: boolean;
}

interface Task {
  id: number;
  title: string;
  language: string | null;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const evaluationId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("bearer_token");
        
        // Fetch evaluation
        const evalResponse = await fetch(`/api/evaluations?id=${evaluationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!evalResponse.ok) throw new Error("Failed to fetch evaluation");
        const evalData = await evalResponse.json();
        setEvaluation(evalData);

        // Fetch task
        const taskResponse = await fetch(`/api/tasks?id=${evalData.taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (taskResponse.ok) {
          const taskData = await taskResponse.json();
          setTask(taskData);
        }
      } catch (err) {
        setError("Failed to load payment details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [evaluationId]);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("bearer_token");

      // Create payment record
      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          evaluationId: parseInt(evaluationId),
          amount: 4.99,
          currency: "USD",
          status: "pending",
        }),
      });

      if (!paymentResponse.ok) throw new Error("Failed to create payment");
      const payment = await paymentResponse.json();

      // Simulate payment processing (in production, integrate with Stripe)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update payment status to completed
      const updateResponse = await fetch(`/api/payments/${payment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "completed",
          stripePaymentId: `mock_${Date.now()}`,
        }),
      });

      if (!updateResponse.ok) throw new Error("Payment failed");

      // Redirect to task page with success
      router.push(`/dashboard/task/${evaluation?.taskId}?unlocked=true`);
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

  if (evaluation?.isPremiumUnlocked) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Already Unlocked!</h2>
            <p className="text-muted-foreground mb-6">
              You already have access to the full report for this evaluation.
            </p>
            <Link href={`/dashboard/task/${evaluation.taskId}`}>
              <Button>View Full Report</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={evaluation ? `/dashboard/task/${evaluation.taskId}` : "/dashboard"}>
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Task
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Unlock Full Report</h1>
        <p className="text-muted-foreground mt-1">
          Get comprehensive AI feedback and recommendations
        </p>
      </div>

      <div className="grid gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCode className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{task?.title || "Code Evaluation"}</h3>
                <p className="text-sm text-muted-foreground">
                  {task?.language || "Unknown"} • Score: {evaluation?.score}/100
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Full Report Access</span>
                <span>$4.99</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Includes</span>
                <span>Lifetime access</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>$4.99 USD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              What&apos;s Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "Detailed code analysis and feedback",
                "Specific improvement recommendations",
                "Performance optimization tips",
                "Best practices suggestions",
                "Lifetime access to this report",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
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
              Demo mode - no real payment will be processed
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
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" disabled={isProcessing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" disabled={isProcessing} />
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
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay $4.99 & Unlock Report
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Secure payment • 100% Money-back guarantee</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

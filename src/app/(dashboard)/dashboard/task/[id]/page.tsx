"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  CreditCard,
  Loader2,
  TrendingUp,
  Target,
  FileCode,
  RefreshCw,
  Crown,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string | null;
  codeContent: string;
  language: string | null;
  status: string;
  createdAt: string;
}

interface Evaluation {
  id: number;
  taskId: number;
  score: number | null;
  strengths: string[] | null;
  improvements: string[] | null;
  detailedFeedback: string | null;
  isPremiumUnlocked: boolean;
  createdAt: string;
}

interface PremiumStatus {
  isPremium: boolean;
  premiumSince: string | null;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState("");

  const taskId = params.id as string;

  const fetchTaskData = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      
      // Fetch task and evaluation
      const response = await fetch(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const data = await response.json();
      setTask(data.task);
      setEvaluation(data.evaluation);

      // Fetch premium status
      const premiumResponse = await fetch("/api/subscription/status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (premiumResponse.ok) {
        const premiumData = await premiumResponse.json();
        setPremiumStatus(premiumData);
      }
    } catch (err) {
      setError("Failed to load task details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, [taskId]);

  const runEvaluation = async () => {
    setIsEvaluating(true);
    setError("");

    try {
      const token = localStorage.getItem("bearer_token");
      
      // Update task status to evaluating
      await fetch(`/api/tasks?id=${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "evaluating" }),
      });

      // Call AI evaluation API
      const evalResponse = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: parseInt(taskId),
          code: task?.codeContent,
          language: task?.language,
          title: task?.title,
          description: task?.description,
        }),
      });

      if (!evalResponse.ok) {
        throw new Error("Evaluation failed");
      }

      // Refresh task data
      await fetchTaskData();
    } catch (err) {
      setError("Failed to run evaluation. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Great";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  // CRITICAL: Premium users get access to ALL detailed feedback
  const hasDetailedFeedbackAccess = premiumStatus?.isPremium === true;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Task</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 mb-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{task?.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="secondary">{task?.language || "Unknown"}</Badge>
            <span className="text-sm text-muted-foreground">
              Submitted {new Date(task?.createdAt || "").toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Code Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            <CardTitle className="text-lg">Submitted Code</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm max-h-64">
            <code>{task?.codeContent}</code>
          </pre>
          {task?.description && (
            <p className="mt-4 text-sm text-muted-foreground">{task.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Evaluation Section */}
      {!evaluation && task?.status !== "evaluating" ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Ready for Evaluation</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Click the button below to run AI-powered evaluation on your code and get detailed feedback.
            </p>
            <Button onClick={runEvaluation} disabled={isEvaluating} size="lg" className="gap-2">
              {isEvaluating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Run AI Evaluation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : task?.status === "evaluating" && !evaluation ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Evaluation in Progress</h2>
            <p className="text-muted-foreground mb-4">
              Our AI is analyzing your code. This usually takes a few seconds...
            </p>
            <Button variant="outline" onClick={fetchTaskData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Status
            </Button>
          </CardContent>
        </Card>
      ) : evaluation ? (
        <>
          {/* Score Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <CardTitle className="text-lg">Evaluation Score</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  AI Generated
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(evaluation.score || 0)}`}>
                    {evaluation.score}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">out of 100</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{getScoreLabel(evaluation.score || 0)}</span>
                  </div>
                  <Progress value={evaluation.score || 0} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <CardTitle className="text-lg">Strengths</CardTitle>
                </div>
                <CardDescription>What you did well</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {evaluation.strengths?.slice(0, 3).map((strength, index) => (
                    <li key={index} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improvements */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                  <CardTitle className="text-lg">Improvements</CardTitle>
                </div>
                <CardDescription>Areas to work on</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {evaluation.improvements?.slice(0, 3).map((improvement, index) => (
                    <li key={index} className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Report / Premium */}
          <Card className={!hasDetailedFeedbackAccess ? "border-primary/50 bg-primary/5" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasDetailedFeedbackAccess ? (
                    <Sparkles className="w-5 h-5 text-primary" />
                  ) : (
                    <Lock className="w-5 h-5 text-primary" />
                  )}
                  <CardTitle className="text-lg">Detailed Feedback Report</CardTitle>
                </div>
                {hasDetailedFeedbackAccess ? (
                  <Badge className="gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Crown className="w-3 h-3" />
                    Premium Access
                  </Badge>
                ) : (
                  <Badge className="gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Crown className="w-3 h-3" />
                    Premium Only
                  </Badge>
                )}
              </div>
              <CardDescription>
                {hasDetailedFeedbackAccess
                  ? "Complete analysis and recommendations - Premium Member Benefit"
                  : "Unlock unlimited reports with Premium subscription"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasDetailedFeedbackAccess ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="mb-4 p-3 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-lg flex items-center gap-2">
                    <Crown className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">Premium Member - Unlimited Access to All Reports</span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {evaluation.detailedFeedback}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Upgrade to Premium</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    Get unlimited access to detailed feedback for ALL your code evaluations. 
                    One-time payment of $29.99 unlocks lifetime access to every report.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/dashboard/payment/upgrade">
                      <Button className="gap-2">
                        <Crown className="w-4 h-4" />
                        Unlock All Reports - $29.99
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Pay once • Unlimited reports forever • No recurring charges
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
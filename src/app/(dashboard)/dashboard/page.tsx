"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileCode,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Crown,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  language: string | null;
  status: string;
  createdAt: string;
}

interface Stats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  averageScore: number | null;
}

interface PremiumStatus {
  isPremium: boolean;
  premiumSince: string | null;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    averageScore: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("bearer_token");
        
        // Fetch tasks
        const response = await fetch("/api/tasks?limit=5", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);

          // Calculate stats
          const completed = data.filter((t: Task) => t.status === "completed").length;
          const pending = data.filter((t: Task) => t.status === "pending" || t.status === "evaluating").length;

          setStats({
            totalTasks: data.length,
            completedTasks: completed,
            pendingTasks: pending,
            averageScore: null,
          });
        }

        // Fetch premium status
        const premiumResponse = await fetch("/api/subscription/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (premiumResponse.ok) {
          const premiumData = await premiumResponse.json();
          setPremiumStatus(premiumData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
      case "evaluating":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Evaluating</Badge>;
      case "pending":
        return <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section with Premium Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">
              Welcome back, {session?.user?.name?.split(" ")[0] || "Developer"}!
            </h1>
            {premiumStatus?.isPremium && (
              <Badge className="gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-sm px-2.5 py-1">
                <Crown className="w-3.5 h-3.5" />
                Premium Member
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            {premiumStatus?.isPremium 
              ? "You have unlimited access to all detailed feedback reports!"
              : "Ready to evaluate your code? Submit a task to get AI-powered feedback."
            }
          </p>
          {premiumStatus?.isPremium && premiumStatus.premiumSince && (
            <p className="text-xs text-muted-foreground mt-1">
              Premium member since {new Date(premiumStatus.premiumSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          )}
        </div>
        <Link href="/dashboard/submit">
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Submit New Task
          </Button>
        </Link>
      </div>

      {/* Premium Upsell Card for Non-Premium Users */}
      {!premiumStatus?.isPremium && !isLoading && (
        <Card className="border-2 border-primary/50 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                <p className="text-muted-foreground mb-4">
                  Get unlimited access to detailed feedback reports for all your code evaluations. 
                  Pay once, benefit forever - just <strong>$29.99</strong> one-time payment.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Unlimited Reports
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Lifetime Access
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    All Features
                  </Badge>
                </div>
              </div>
              <Link href="/dashboard/payment/upgrade">
                <Button size="lg" className="gap-2">
                  <Crown className="w-4 h-4" />
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your latest code submissions</CardDescription>
          </div>
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-4">
                Submit your first coding task to get AI-powered evaluation
              </p>
              <Link href="/dashboard/submit">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Your First Task
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Link key={task.id} href={`/dashboard/task/${task.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileCode className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {task.language || "Unknown"} • {formatDate(task.createdAt)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { AIChatbot } from "@/components/ai-chatbot";
import { TextHoverEffect, FooterBackgroundGradient } from "@/components/ui/hover-footer";
import {
  Code2,
  Sparkles,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  FileCode,
  TrendingUp,
  Lock,
  Crown,
  Infinity,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Dribbble,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: FileCode,
    title: "Submit Your Code",
    description: "Upload any coding task in JavaScript, Python, TypeScript, and more.",
  },
  {
    icon: Sparkles,
    title: "AI Analysis",
    description: "Our AI evaluates your code for quality, best practices, and efficiency.",
  },
  {
    icon: TrendingUp,
    title: "Get Feedback",
    description: "Receive a score, strengths, and actionable improvement suggestions.",
  },
  {
    icon: Lock,
    title: "Unlock Details",
    description: "Upgrade to Premium for unlimited access to detailed feedback reports.",
  },
];

const benefits = [
  "Score from 0-100 based on code quality",
  "Identify strengths in your code",
  "Get specific improvement suggestions",
  "Unlimited detailed feedback (Premium)",
  "Track your progress over time",
  "Support for 15+ languages",
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    content: "AssessIQ helped me identify blind spots in my code I never knew existed. The AI feedback is incredibly insightful.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "CS Student",
    content: "As a student, this tool has been invaluable for improving my coding skills. The detailed reports are worth every penny.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    content: "I use AssessIQ before every code review. It catches issues and suggests improvements I might have missed.",
    rating: 5,
  },
];

// Footer data
const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "API Docs", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", href: "#" },
      { label: "Help Center", href: "#" },
      {
        label: "Live Chat",
        href: "#",
        pulse: true,
      },
    ],
  },
];

const contactInfo = [
  {
    icon: <Mail size={18} className="text-primary" />,
    text: "hello@assessiq.com",
    href: "mailto:hello@assessiq.com",
  },
  {
    icon: <Phone size={18} className="text-primary" />,
    text: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: <MapPin size={18} className="text-primary" />,
    text: "San Francisco, CA",
  },
];

const socialLinks = [
  { icon: <Facebook size={20} />, label: "Facebook", href: "#" },
  { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
  { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
  { icon: <Dribbble size={20} />, label: "Dribbble", href: "#" },
  { icon: <Globe size={20} />, label: "Website", href: "#" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-black dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-black/80 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AssessIQ</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Grid Background */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Code Evaluation
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Get Expert Feedback on Your Code in{" "}
            <span className="text-primary">Seconds</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Submit your coding tasks and receive AI-powered evaluation with scores,
            strengths, and actionable improvement suggestions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-lg px-8">
                Start Free Evaluation
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required Free evaluation preview
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get professional code feedback in four simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Everything You Need to Improve Your Code
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI-powered evaluation provides comprehensive feedback to help you
                write better, more maintainable code.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    Try It Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Card className="border-2 border-border shadow-2xl bg-card">
                <CardHeader className="bg-slate-900 dark:bg-slate-800 text-white rounded-t-lg border-b-2 border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-sm opacity-80 font-medium">evaluation.json</span>
                  </div>
                </CardHeader>
                <CardContent className="bg-slate-950 dark:bg-slate-900 text-slate-50 dark:text-slate-100 p-6 rounded-b-lg font-mono text-sm border-2 border-t-0 border-slate-700">
                  <pre className="overflow-x-auto">
{`{
  "score": 85,
  "strengths": [
    "Clean code structure",
    "Good naming conventions",
    "Efficient algorithm"
  ],
  "improvements": [
    "Add error handling",
    "Consider edge cases",
    "Add comments"
  ]
}`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-lg text-muted-foreground">
              Free preview • One-time payment for unlimited access
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Free Preview</CardTitle>
                <CardDescription>Perfect for quick evaluations</CardDescription>
                <div className="text-4xl font-bold mt-4">$0</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Overall score (0-100)",
                    "Top 3 strengths",
                    "Top 3 improvements",
                    "Unlimited evaluations",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button variant="outline" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                  <Crown className="w-3 h-3" />
                  Premium
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="w-6 h-6 text-primary" />
                  Premium Access
                </CardTitle>
                <CardDescription>Unlimited detailed reports</CardDescription>
                <div className="text-4xl font-bold mt-4">
                  $29.99
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}one-time
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Everything in Free",
                    "Unlimited detailed feedback",
                    "All past & future reports",
                    "Comprehensive code analysis",
                    "Performance optimization tips",
                    "Lifetime access - pay once",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button className="w-full gap-2">
                    <Crown className="w-4 h-4" />
                    Start with Premium
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  <Infinity className="w-3 h-3 inline mr-1" />
                  Better value than $4.99 per report
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Developers
            </h2>
            <p className="text-lg text-muted-foreground">
              See what others are saying about AssessIQ
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Improve Your Code?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are writing better code with AssessIQ.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 gap-2"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* New Hover Footer */}
      <footer className="bg-slate-900/90 dark:bg-[#0F0F11]/90 relative h-fit  overflow-hidden">
        <div className="max-w-7xl mx-auto p-14 z-40 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12 pb-12">
            {/* Brand section */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-white text-2xl font-bold">AssessIQ</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                AI-powered code evaluation platform that helps developers write better, more maintainable code.
              </p>
            </div>

            {/* Footer link sections */}
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-white text-sm font-semibold mb-3">
                  {section.title}
                </h4>
                <ul className="space-y-1.5">
                  {section.links.map((link) => (
                    <li key={link.label} className="relative">
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-primary transition-colors text-xs"
                      >
                        {link.label}
                      </a>
                      {link.pulse && (
                        <span className="absolute top-0 right-[-10px] w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact section */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">
                Contact Us
              </h4>
              <ul className="space-y-2">
                {contactInfo.map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="[&>svg]:w-3.5 [&>svg]:h-3.5">{item.icon}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-gray-400 hover:text-primary transition-colors text-xs"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-gray-400 hover:text-primary transition-colors text-xs">
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          

          {/* Footer bottom */}
         
        </div>

        {/* Text hover effect */}
        <div className="lg:flex hidden h-[30rem] mt-5 -mb-36">
          <TextHoverEffect text="AssessIQ" className="z-50" />
        </div>

        <FooterBackgroundGradient />
      </footer>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
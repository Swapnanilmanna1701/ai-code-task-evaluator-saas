"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { AIChatbot } from "@/components/ai-chatbot";
import { TextHoverEffect, FooterBackgroundGradient } from "@/components/ui/hover-footer";
import { TestimonialSlider } from "@/components/ui/testimonial-slider";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { AuroraHeroBackground } from "@/components/ui/futuristic-hero-section";
import { ModernPricingSection, PricingCardProps } from "@/components/ui/animated-glassy-pricing";
import { Navbar } from "@/components/ui/mini-navbar";
import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";
import { cn } from "@/lib/utils";
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
  ChevronRight,
} from "lucide-react";

// Timeline data for How It Works section
const howItWorksData = [
  {
    id: 1,
    title: "Submit Code",
    date: "Step 1",
    content: "Upload any coding task in JavaScript, Python, TypeScript, and more. Our platform supports 15+ programming languages.",
    category: "Input",
    icon: FileCode,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "AI Analysis",
    date: "Step 2",
    content: "Our AI evaluates your code for quality, best practices, efficiency, and potential improvements.",
    category: "Processing",
    icon: Sparkles,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "Get Feedback",
    date: "Step 3",
    content: "Receive a comprehensive score, identified strengths, and actionable improvement suggestions.",
    category: "Output",
    icon: TrendingUp,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Unlock Details",
    date: "Step 4",
    content: "Upgrade to Premium for unlimited access to detailed feedback reports and advanced analytics.",
    category: "Premium",
    icon: Lock,
    relatedIds: [3],
    status: "pending" as const,
    energy: 30,
  },
];

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
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    quote: "AssessIQ helped me identify blind spots in my code I never knew existed. The AI feedback is incredibly insightful.",
    name: "Sarah Chen",
    role: "Software Engineer",
  },
  {
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote: "As a student, this tool has been invaluable for improving my coding skills. The detailed reports are worth every penny.",
    name: "Marcus Johnson",
    role: "CS Student",
  },
  {
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "I use AssessIQ before every code review. It catches issues and suggests improvements I might have missed.",
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
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
  const router = useRouter();

  // Pricing plans data synchronized with your app's pricing
  const pricingPlans: PricingCardProps[] = [
    { 
      planName: 'Free', 
      description: 'Perfect for quick evaluations', 
      price: '0', 
      priceLabel: '',
      features: [
        'Overall score (0-100)',
        'Top 3 strengths',
        'Top 3 improvements',
        'Unlimited evaluations'
      ], 
      buttonText: 'Get Started Free', 
      buttonVariant: 'secondary',
      onButtonClick: () => router.push('/signup')
    },
    { 
      planName: 'Premium', 
      description: 'Unlimited detailed reports', 
      price: '29.99', 
      priceLabel: 'one-time',
      features: [
        'Everything in Free',
        'Unlimited detailed feedback',
        'All past & future reports',
        'Comprehensive code analysis',
        'Performance optimization tips',
        'Lifetime access - pay once'
      ], 
      buttonText: 'Start with Premium', 
      isPopular: true, 
      buttonVariant: 'primary',
      onButtonClick: () => router.push('/signup')
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-black dark:to-slate-950">
      {/* New Mini Navbar */}
      <Navbar />

      {/* Hero Section with Aurora Background */}
      <AuroraHeroBackground className="py-20 md:py-32 pt-32 md:pt-40">
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedGradientText className="mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
              )}
            >
              AI-Powered Code Evaluation
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto text-white">
            Get Expert Feedback on Your Code in{" "}
            <span className="text-primary">Seconds</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
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
              <Button size="lg" variant="outline" className="text-lg px-8 border-white/30 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required Free evaluation preview
          </p>
        </div>
      </AuroraHeroBackground>

      {/* How It Works - Radial Orbital Timeline */}
      <section className="py-20 bg-slate-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get professional code feedback in four simple steps. Click on any node to explore.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <RadialOrbitalTimeline timelineData={howItWorksData} />
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

      {/* New Animated Glassy Pricing Section */}
      <section className="bg-slate-50 dark:bg-slate-950/50">
        <ModernPricingSection
          title="Simple Pricing"
          subtitle="Free preview • One-time payment for unlimited access"
          plans={pricingPlans}
          showAnimatedBackground={true}
        />
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
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* CTA with 3D Robot */}
      <section className="relative bg-black dark:bg-black overflow-hidden">
        <div className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
          {/* Content - Left/Center Side */}
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Text Content - Centered on mobile, left on desktop */}
                <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0 lg:pl-8">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                    Ready to Improve Your Code?
                  </h2>
                  <p className="text-lg md:text-xl opacity-90 mb-8 text-gray-200 drop-shadow-md">
                    Join thousands of developers who are writing better code with AssessIQ.
                  </p>
                  <div>
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
                </div>
                
                {/* Spacer for robot area on desktop */}
                <div className="hidden lg:block" />
              </div>
            </div>
          </div>
          
          {/* 3D Robot - Right Side */}
          <div className="absolute inset-y-0 dark:bg-black right-0 w-full lg:w-[60%] xl:w-[55%] h-full z-0">
            <InteractiveRobotSpline
              scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
              className="w-full h-full"
            />
          </div>
          
          {/* Gradient overlay for text readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black to-black lg:via-gray-900/60" />
        </div>
      </section>

      {/* New Hover Footer */}
      <footer className="bg-slate-900/90 dark:bg-black relative h-fit  overflow-hidden">
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
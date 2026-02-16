import { Metadata } from 'next'
import Link from 'next/link'
import { Brain, Search, Users, Zap, Check, Github, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import WaitlistForm from '@/components/waitlist-form'

export const metadata: Metadata = {
  title: 'CHAOS - Stop Losing Context Between AI Agent Sessions',
  description: 'The memory layer for AI agents. CHAOS remembers so your AI doesn\'t forget. Instant recall across all agent sessions with semantic search.',
  keywords: 'AI memory, agent memory, OpenClaw, Claude, context management, semantic search',
  openGraph: {
    title: 'CHAOS - Stop Losing Context Between AI Agent Sessions',
    description: 'The memory layer for AI agents. CHAOS remembers so your AI doesn\'t forget.',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">CHAOS</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="https://github.com/hargabyte/chaos" className="text-sm font-medium hover:text-primary transition-colors">
              GitHub
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="#waitlist">
              <Button size="sm">Join Waitlist</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 mb-8 text-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>The Memory Layer for AI Agents</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Stop losing context between agent sessions.{' '}
            <span className="text-primary">CHAOS remembers</span> so your AI doesn't forget.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Instant recall across all your AI agent sessions. No more manual notes, no more grepping through logs, no more lost context.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#waitlist">
              <Button size="lg" className="text-lg px-8">
                Join Waitlist <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://github.com/hargabyte/chaos">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Github className="mr-2 h-5 w-5" /> View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-500">The Problem</h2>
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-2xl">✗</span>
                  <span>Agents forget critical decisions between sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-2xl">✗</span>
                  <span>Manual notes scattered across files and tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-2xl">✗</span>
                  <span>Grepping through session logs wastes 30-60 minutes daily</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-2xl">✗</span>
                  <span>Context loss leads to repeated mistakes</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-500">The Solution</h2>
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-2xl">✓</span>
                  <span>Instant recall across all agent sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-2xl">✓</span>
                  <span>Unified memory system with semantic search</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-2xl">✓</span>
                  <span>10x faster context retrieval</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-2xl">✓</span>
                  <span>Reduce repeated mistakes by 70%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 border-t">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for AI Practitioners
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to give your agents a persistent, searchable memory
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Search className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Semantic Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find memories by meaning, not just keywords. AI-powered search understands context.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Multi-Workspace</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Separate memories by project, client, or context. Keep everything organized.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Team Memory</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share memories across agent teams. Enable true collaborative intelligence.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>API Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  REST + WebSocket APIs for seamless integration with OpenClaw, Claude, and custom agents.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Integrates With Your Workflow</h2>
            <p className="text-xl text-muted-foreground">
              Built for the tools AI practitioners already use
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <div className="flex items-center space-x-2 text-2xl font-bold">
              <Brain className="h-8 w-8" />
              <span>OpenClaw</span>
            </div>
            <div className="text-2xl font-bold">Claude</div>
            <div className="text-2xl font-bold">Cursor</div>
            <div className="text-2xl font-bold">VS Code</div>
            <div className="flex items-center space-x-2 text-2xl font-bold">
              <Github className="h-8 w-8" />
              <span>GitHub</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20 border-t">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you need more
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  $0<span className="text-base font-normal text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span>1,000 memories</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span>Single workspace</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span>Basic search</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span>Community support</span>
                  </li>
                </ul>
                <Link href="#waitlist" className="block">
                  <Button variant="outline" className="w-full mt-6">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-primary border-2 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  $15<span className="text-base font-normal text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-medium">Unlimited memories</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-medium">Unlimited workspaces</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-medium">Advanced semantic search</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-medium">API access</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-medium">Priority support</span>
                  </li>
                </ul>
                <Link href="#waitlist" className="block">
                  <Button className="w-full mt-6">
                    Join Waitlist
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Team Tier */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Team</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  $49<span className="text-base font-normal text-muted-foreground">/month</span>
                </CardDescription>
                <CardDescription className="text-sm">+ $10/additional user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-medium">Shared team memory</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-medium">Role-based access</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span>Audit logs</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span>Slack/webhook integrations</span>
                  </li>
                </ul>
                <Link href="#waitlist" className="block">
                  <Button variant="outline" className="w-full mt-6">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="container mx-auto px-4 py-20 border-t">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Waitlist
            </h2>
            <p className="text-xl text-muted-foreground">
              Be among the first to experience persistent AI memory. Early access starts soon.
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#waitlist" className="hover:text-foreground transition-colors">Waitlist</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="https://github.com/hargabyte/chaos" className="hover:text-foreground transition-colors">GitHub</Link></li>
                <li><Link href="/api" className="hover:text-foreground transition-colors">API Reference</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="https://github.com/hargabyte/chaos" className="hover:text-foreground transition-colors">GitHub</Link></li>
                <li><Link href="https://discord.gg/openclaw" className="hover:text-foreground transition-colors">Discord</Link></li>
                <li><Link href="https://twitter.com/chaos_memory" className="hover:text-foreground transition-colors">Twitter</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 CHAOS Memory System. Built by <Link href="https://hargabyte.com" className="hover:text-foreground transition-colors">Hargabyte Software</Link>.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

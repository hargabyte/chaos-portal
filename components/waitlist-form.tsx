'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: Integrate with backend API
    // For now, just simulate submission
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      console.log('Waitlist submission:', { name, email })
    }, 1000)
  }

  if (submitted) {
    return (
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
            <p className="text-muted-foreground">
              We'll send you an email at <strong>{email}</strong> when early access is available.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-lg"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full text-lg py-6"
            disabled={loading}
          >
            {loading ? 'Joining...' : 'Join Waitlist'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By joining, you agree to receive updates about CHAOS. Unsubscribe anytime.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

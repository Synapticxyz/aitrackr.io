'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, type SignUpInput } from '@/lib/validations'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(data: SignUpInput) {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json() as { error?: string }
      if (!res.ok) { toast.error(json.error ?? 'Sign up failed'); return }
      toast.success('Account created! Signing you in...')
      const result = await signIn('credentials', { email: data.email, password: data.password, redirect: false })
      if (result?.ok) { router.push('/dashboard') } else {
        toast.error('Account created but sign-in failed. Please sign in manually.')
        router.push('/auth/signin')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4 grid-bg">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <Image src="/logo.png" alt="AiTrackr" width={180} height={40} className="h-10 w-auto object-contain" />
        </div>

        <div className="border border-white/10 bg-[#111111] p-8">
          <div className="mb-6">
            <p className="text-xs font-mono text-gray-500 mb-1">// AUTH</p>
            <h1 className="text-xl font-bold font-mono text-white">CREATE_ACCOUNT</h1>
            <p className="text-sm text-gray-400 mt-1">Start tracking free</p>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 py-3 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm font-mono text-gray-300 mb-6"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            CONTINUE_WITH_GOOGLE
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-mono text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-mono text-gray-400">NAME</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" className="font-mono text-sm bg-black border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs font-mono" />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-mono text-gray-400">EMAIL</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" className="font-mono text-sm bg-black border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs font-mono" />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-mono text-gray-400">PASSWORD</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" className="font-mono text-sm bg-black border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs font-mono" />
                </FormItem>
              )} />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-500 text-black font-mono font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? 'CREATING_ACCOUNT...' : 'CREATE_ACCOUNT'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </Form>

          <p className="text-center text-xs font-mono text-gray-600 mt-6">
            By signing up you agree to our{' '}
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link> &amp;{' '}
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
          </p>
          <p className="text-center text-xs font-mono text-gray-600 mt-3">
            HAVE_ACCOUNT?{' '}
            <Link href="/auth/signin" className="text-amber-500 hover:text-amber-400">SIGN_IN</Link>
          </p>
        </div>

        <p className="text-center text-xs font-mono text-gray-700 mt-6">
          <Link href="/" className="hover:text-gray-500 transition-colors">← BACK_TO_SITE</Link>
        </p>
      </div>
    </div>
  )
}

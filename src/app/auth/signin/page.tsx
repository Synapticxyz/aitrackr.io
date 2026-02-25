'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInInput } from '@/lib/validations'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Activity, ArrowRight } from 'lucide-react'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const [loading, setLoading] = useState(false)

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: SignInInput) {
    setLoading(true)
    const result = await signIn('credentials', { email: data.email, password: data.password, redirect: false })
    setLoading(false)
    if (result?.error) {
      toast.error('Invalid email or password')
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4 grid-bg">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 bg-white flex items-center justify-center">
            <Activity className="w-5 h-5 text-black" />
          </div>
          <span className="font-mono font-bold text-xl text-white">AiTrackr</span>
        </div>

        <div className="border border-white/10 bg-[#111111] p-8">
          <div className="mb-6">
            <p className="text-xs font-mono text-gray-500 mb-1">// AUTH</p>
            <h1 className="text-xl font-bold font-mono text-white">SIGN_IN</h1>
            <p className="text-sm text-gray-400 mt-1">Welcome back</p>
          </div>

          {/* Google */}
          <button
            onClick={() => signIn('google', { callbackUrl })}
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
                    <Input type="password" className="font-mono text-sm bg-black border-white/10 text-white focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs font-mono" />
                </FormItem>
              )} />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-500 text-black font-mono font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? 'SIGNING_IN...' : 'SIGN_IN'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </Form>

          <p className="text-center text-xs font-mono text-gray-600 mt-6">
            NO_ACCOUNT?{' '}
            <Link href="/auth/signup" className="text-amber-500 hover:text-amber-400">SIGN_UP</Link>
          </p>
        </div>

        <p className="text-center text-xs font-mono text-gray-700 mt-6">
          <Link href="/" className="hover:text-gray-500 transition-colors">← BACK_TO_SITE</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}

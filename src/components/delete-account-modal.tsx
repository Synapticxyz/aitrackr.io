'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'

interface DeleteAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)

  const CONFIRMATION_TEXT = 'delete my account'

  async function handleDelete() {
    if (confirmation !== CONFIRMATION_TEXT) return

    setLoading(true)
    try {
      const res = await fetch('/api/user/delete', { method: 'POST' })
      if (res.ok) {
        toast.success('Account deletion scheduled. You will be signed out.')
        setTimeout(() => signOut({ callbackUrl: '/' }), 2000)
      } else {
        toast.error('Failed to delete account. Please try again.')
      }
    } catch {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Your account and all data will be permanently
            deleted within 30 days. Active subscriptions will be cancelled immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
            <p className="text-sm text-destructive font-medium">This will delete:</p>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc list-inside">
              <li>Your account and profile</li>
              <li>All tracked subscriptions</li>
              <li>All usage history</li>
              <li>Your active Pro subscription</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <span className="font-mono font-bold">{CONFIRMATION_TEXT}</span> to confirm
            </Label>
            <Input
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={CONFIRMATION_TEXT}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmation !== CONFIRMATION_TEXT || loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

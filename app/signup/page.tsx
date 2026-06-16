import { AuthShell } from '@/components/auth/auth-shell'
import { AuthForm } from '@/components/auth/auth-form'

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start dating the Virtual Date way — meet before you meet."
    >
      <AuthForm mode="signup" />
    </AuthShell>
  )
}

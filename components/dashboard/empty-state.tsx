import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onClick?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionText, actionHref, onClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-white/5 rounded-[2.5rem] bg-gradient-to-br from-[#1b1522]/30 via-card/10 to-[#120f1a]/50 backdrop-blur-md shadow-lg max-w-md mx-auto animate-fade-in-up">
      <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 shadow-inner shadow-primary/5">
        <Icon className="size-8 text-primary" />
      </div>
      <h3 className="text-xl font-heading font-extrabold text-white mb-2.5">{title}</h3>
      <p className="text-muted-foreground/90 text-sm leading-relaxed mb-6 max-w-xs">{description}</p>
      {actionText && (
        actionHref ? (
          <Link href={actionHref} passHref>
            <Button className="h-11 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-md shadow-primary/25 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:opacity-95">
              {actionText}
            </Button>
          </Link>
        ) : (
          <Button onClick={onClick} className="h-11 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-md shadow-primary/25 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:opacity-95">
            {actionText}
          </Button>
        )
      )}
    </div>
  )
}

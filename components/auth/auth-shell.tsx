import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="relative flex flex-col px-4 py-8 md:px-10">
        <Link href="/" className="w-fit" aria-label="Virtual Date home">
          <Logo />
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="font-heading text-3xl font-semibold tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/hero-coffee-date.png"
          alt="A virtual coffee date"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <p className="font-heading text-2xl font-semibold text-balance">
            &ldquo;We met before we met. By our first real date, it already felt
            like home.&rdquo;
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Maya &amp; James — matched on Virtual Date
          </p>
        </div>
      </div>
    </div>
  )
}

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, Plus } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 glass border-b border-surface-border/50">
        <Link href="/dashboard" className="text-xl font-bold gradient-text">
          IdeaLaunch
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-surface-raised transition-all"
          >
            <LayoutDashboard size={15} />
            My apps
          </Link>
          <Link
            href="/new"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-surface-raised transition-all"
          >
            <Plus size={15} />
            New app
          </Link>
        </nav>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}

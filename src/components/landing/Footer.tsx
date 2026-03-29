export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-surface-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xl font-bold gradient-text">IdeaLaunch</span>
        <p className="text-sm text-white/30">
          © {new Date().getFullYear()} IdeaLaunch. Built for founders with ideas.
        </p>
        <div className="flex items-center gap-6 text-sm text-white/40">
          <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
          <a href="mailto:hello@idealanunch.com" className="hover:text-white/70 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

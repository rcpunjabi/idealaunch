export default function Footer() {
  return (
    <footer className="bg-navy py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xl font-bold font-heading text-white">
              Idea<span className="text-terra-light">Launch</span>
            </span>
            <p className="text-sm text-white/40 mt-1 italic">Spark. Scale. Repeat.</p>
          </div>

          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} IdeaLaunch. Built for founders with ideas.
          </p>

          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
            <a href="mailto:hello@idealanunch.com" className="hover:text-white/70 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

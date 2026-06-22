import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-auto py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Jason Dinamarca — jdinamarca.dev</p>
        <div className="flex gap-4">
          <Link href="https://github.com/jdinamarca" target="_blank" className="hover:text-foreground transition-colors">
            GitHub
          </Link>
          <Link href="https://linkedin.com/in/jdinamarca" target="_blank" className="hover:text-foreground transition-colors">
            LinkedIn
          </Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
        </div>
      </div>
    </footer>
  );
}

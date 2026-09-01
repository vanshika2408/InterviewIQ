function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="InterviewIQ" className="h-7 w-auto object-contain" />
          <p>© 2026 InterviewIQ. All rights reserved.</p>
        </div>

        <p>Practice smarter. Interview better.</p>
      </div>
    </footer>
  );
}

export default Footer;
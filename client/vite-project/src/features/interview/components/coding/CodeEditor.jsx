function CodeEditor({ code, setCode, language }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-medium">Code</span>

        <span className="text-xs text-muted-foreground">
          {language}
        </span>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
        className="min-h-[420px] flex-1 resize-none bg-muted/20 p-5 font-mono text-sm leading-6 outline-none"
      />
    </div>
  );
}

export default CodeEditor;
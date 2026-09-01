function SettingSection({ title, description, children }) {
  return (
    <section className="rounded-xl border bg-background">
      <div className="border-b p-6">
        <h2 className="font-semibold">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

export default SettingSection;
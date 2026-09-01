import { CheckCircle2, FileQuestion } from "lucide-react";

function ResumeSummary({ resumeData }) {
  const extracted = resumeData?.extractedData;
  const hasExtracted = extracted && (
    (extracted.skills && extracted.skills.length > 0) ||
    (extracted.experience && extracted.experience.length > 0) ||
    (extracted.projects && extracted.projects.length > 0) ||
    (extracted.education && extracted.education.length > 0)
  );

  if (!resumeData || !hasExtracted) {
    return (
      <div className="rounded-xl border bg-background p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
          <FileQuestion className="h-6 w-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold">No resume analysis available</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Upload your PDF resume above to extract skills, experience, projects, and education.
        </p>
      </div>
    );
  }

  const sections = [
    { title: "Skills", items: extracted.skills || [] },
    { title: "Experience", items: extracted.experience || [] },
    { title: "Projects", items: extracted.projects || [] },
    { title: "Education", items: extracted.education || [] },
  ].filter((sec) => sec.items.length > 0);

  return (
    <div className="rounded-xl border bg-background">
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>

          <div>
            <h2 className="font-semibold">AI resume analysis</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Information extracted from your uploaded resume.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-medium">{section.title}</h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {section.items.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-md border px-3 py-1.5 text-xs bg-muted/40"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeSummary;
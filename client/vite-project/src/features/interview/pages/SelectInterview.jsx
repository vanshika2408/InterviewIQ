import { useState } from "react";
import { ArrowRight, Clock3, Code2, MessageSquareText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createInterview } from "../../../services/api";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Java Developer",
  "React Developer",
  "Software Engineer",
];

const interviewTypes = [
  {
    value: "Technical",
    label: "Technical",
    description: "Concepts, technologies, and problem solving.",
    icon: Code2,
  },
  {
    value: "HR",
    label: "HR / Behavioral",
    description: "Communication, behavior, and workplace scenarios.",
    icon: MessageSquareText,
  },
];

const difficulties = ["Easy", "Medium", "Hard"];

const durations = ["15 min", "30 min", "45 min", "60 min"];

const languages = ["English", "Hindi", "Hinglish"];

const topics = [
  "DSA",
  "DBMS",
  "OS",
  "Computer Networks",
  "OOP",
  "React",
  "Java",
  "Node.js",
];

function SelectInterview() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "",
    type: "",
    difficulty: "Medium",
    duration: "30 min",
    language: "English",
    topics: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleTopic = (topic) => {
    setForm((current) => ({
      ...current,
      topics: current.topics.includes(topic)
        ? current.topics.filter((item) => item !== topic)
        : [...current.topics, topic],
    }));
  };

  const canContinue = form.role && form.type;

  const handleContinue = async () => {
    if (!canContinue || loading) return;

    setError("");
    setLoading(true);

    try {
      const payload = {
        type: form.type.toLowerCase(),
        role: form.role,
        difficulty: form.difficulty.toLowerCase(),
        duration: parseInt(form.duration) || 30,
        language: form.language,
        topics: form.topics,
      };

      const res = await createInterview(payload);
      if (res.success && res.interview) {
        navigate("/interview/lobby", {
          state: { interview: res.interview },
        });
      } else {
        setError("Failed to create interview session.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 lg:p-8">
      <div>
        <p className="text-sm text-muted-foreground">New interview</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Set up your interview
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Customize your session before you begin.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Role */}
        <section className="rounded-xl border bg-background p-6">
          <h2 className="font-semibold">Target role</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            What position are you preparing for?
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => updateField("role", role)}
                className={`rounded-lg border p-4 text-left text-sm transition ${
                  form.role === role
                    ? "border-foreground bg-muted"
                    : "hover:bg-muted/50"
                }`}
              >
                <span className="font-medium">{role}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Interview type */}
        <section className="rounded-xl border bg-background p-6">
          <h2 className="font-semibold">Interview type</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the type of interview you want to practice.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {interviewTypes.map((type) => {
              const Icon = type.icon;

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateField("type", type.value)}
                  className={`rounded-xl border p-5 text-left transition ${
                    form.type === type.value
                      ? "border-foreground bg-muted"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />

                  <p className="mt-4 font-medium">{type.label}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Difficulty + duration */}
        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border bg-background p-6">
            <h2 className="font-semibold">Difficulty</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => updateField("difficulty", difficulty)}
                  className={`rounded-lg border px-4 py-2 text-sm ${
                    form.difficulty === difficulty
                      ? "border-foreground bg-muted font-medium"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-background p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <Clock3 className="h-4 w-4" />
              Duration
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {durations.map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => updateField("duration", duration)}
                  className={`rounded-lg border px-4 py-2 text-sm ${
                    form.duration === duration
                      ? "border-foreground bg-muted font-medium"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="rounded-xl border bg-background p-6">
          <h2 className="font-semibold">Language</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {languages.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => updateField("language", language)}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  form.language === language
                    ? "border-foreground bg-muted font-medium"
                    : "hover:bg-muted/50"
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </section>

        {/* Topics */}
        <section className="rounded-xl border bg-background p-6">
          <h2 className="font-semibold">Topics</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select the areas you want to practice.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map((topic) => {
              const selected = form.topics.includes(topic);

              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-lg border px-4 py-2 text-sm ${
                    selected
                      ? "border-foreground bg-muted font-medium"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </section>

        {/* Continue */}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!canContinue || loading}
            onClick={handleContinue}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Creating..." : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectInterview;
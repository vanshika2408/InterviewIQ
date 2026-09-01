import { motion } from "framer-motion";
import {
  BarChart3,
  BrainCircuit,
  Code2,
  FileText,
  Mic,
  Target,
  Trophy,
  Users,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Interviews",
    description:
      "Practice realistic interviews generated around your role, experience level, and selected topics.",
  },
  {
    icon: Mic,
    title: "Voice Interviews",
    description:
      "Answer naturally using your voice and receive feedback on communication and delivery.",
  },
  {
    icon: Code2,
    title: "Coding Interviews",
    description:
      "Solve coding problems in an interview-style editor with multiple language options.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Track your progress across accuracy, confidence, communication, and technical skills.",
  },
  {
    icon: FileText,
    title: "Resume Intelligence",
    description:
      "Upload your resume and let InterviewIQ personalize your preparation around your experience.",
  },
  {
    icon: Target,
    title: "Weak Area Detection",
    description:
      "Identify the topics holding you back and focus your preparation where it matters most.",
  },
  {
    icon: Trophy,
    title: "Gamified Progress",
    description:
      "Earn XP, unlock achievements, maintain streaks, and compete on the leaderboard.",
  },
  {
    icon: Users,
    title: "Interview Preparation",
    description:
      "Prepare for technical, behavioral, HR, and role-specific interview rounds in one place.",
  },
];

function Features() {
  return (
    <main>
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl"
          >
            <p className="text-sm font-medium">INTERVIEWIQ FEATURES</p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Everything you need to
              <br />
              <span className="text-muted-foreground">
                interview with confidence.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Practice realistic interviews, understand your weaknesses, and
              build the skills you need to perform when it actually matters.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-xl border bg-background p-6"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border bg-muted/40">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="font-semibold">{feature.title}</h2>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Features;
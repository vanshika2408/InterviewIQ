import { motion } from "framer-motion";
import { BrainCircuit, Target, TrendingUp } from "lucide-react";

const principles = [
  {
    icon: BrainCircuit,
    title: "Practice with purpose",
    description:
      "Every interview should teach you something. InterviewIQ turns each attempt into actionable feedback.",
  },
  {
    icon: Target,
    title: "Focus on what matters",
    description:
      "Instead of practicing everything, identify the skills and topics that need your attention most.",
  },
  {
    icon: TrendingUp,
    title: "Improve continuously",
    description:
      "Your preparation should evolve with you. Track your progress and see how your performance changes over time.",
  },
];

function About() {
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
            <p className="text-sm font-medium">ABOUT INTERVIEWIQ</p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Interview preparation should be
              <br />
              <span className="text-muted-foreground">
                smarter, not harder.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              InterviewIQ is built to give candidates a realistic place to
              practice, receive meaningful feedback, and become more confident
              before the real interview.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built around your improvement
            </h2>

            <p className="mt-4 text-muted-foreground">
              InterviewIQ combines realistic practice with measurable
              feedback so preparation becomes a process instead of guesswork.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-xl border p-6"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border bg-muted/40">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="font-semibold">{principle.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {principle.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The goal is simple.
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Walk into your next interview knowing you've already practiced the
            questions, challenges, and situations you're likely to face.
          </p>
        </div>
      </section>
    </main>
  );
}

export default About;
import {
  BarChart3,
  Code2,
  MessageSquareText,
  Mic,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Mic,
    title: "AI Interviews",
    description:
      "Practice realistic interviews tailored to your role, difficulty, and goals.",
  },
  {
    icon: MessageSquareText,
    title: "Instant Feedback",
    description:
      "Understand the strengths and weaknesses behind every answer.",
  },
  {
    icon: Code2,
    title: "Coding Rounds",
    description:
      "Solve coding problems in a real interview-style environment.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description:
      "See your performance evolve across skills, topics, and interviews.",
  },
];

function FeaturesPreview() {
  return (
    <section className="border-t bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium">Everything you need</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Prepare like the real interview is tomorrow.
          </h2>

          <p className="mt-4 text-muted-foreground">
            One platform for practicing, measuring, and improving your
            interview performance.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border bg-background p-6"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesPreview;
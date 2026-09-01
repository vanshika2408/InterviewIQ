import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            AI-powered interview preparation
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Practice interviews.
            <br />
            <span className="text-muted-foreground">
              Get better every time.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            InterviewIQ conducts realistic AI interviews, evaluates your
            answers, and shows you exactly where to improve.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start practicing
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/features"
              className="rounded-lg border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Explore features
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
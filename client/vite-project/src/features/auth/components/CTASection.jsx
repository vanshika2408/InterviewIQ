import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="border-t py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl px-6 text-center lg:px-8"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Your next interview can be better.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Stop guessing what went wrong. Practice, get feedback, and improve
          with every interview.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Start practicing
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}

export default CTASection;
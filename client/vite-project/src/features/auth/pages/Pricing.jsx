import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    description: "Get started with essential interview practice.",
    price: "0",
    features: [
      "3 AI interviews per month",
      "Basic performance feedback",
      "Core interview topics",
      "Progress tracking",
    ],
    action: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    description: "Unlimited preparation for serious candidates.",
    price: "12",
    features: [
      "Unlimited AI interviews",
      "Advanced AI feedback",
      "Voice interviews",
      "Coding interviews",
      "Detailed analytics",
      "Resume-based preparation",
    ],
    action: "Start Pro",
    featured: true,
  },
  {
    name: "Premium",
    description: "The complete interview preparation experience.",
    price: "24",
    features: [
      "Everything in Pro",
      "Advanced interview simulations",
      "Company-specific preparation",
      "Priority AI processing",
      "Advanced progress insights",
      "Premium achievements",
    ],
    action: "Go Premium",
    featured: false,
  },
];

function Pricing() {
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
            <p className="text-sm font-medium">PRICING</p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Choose how you want to
              <br />
              <span className="text-muted-foreground">
                prepare for your next interview.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Start for free and upgrade when you're ready to take your
              preparation further.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-3 lg:px-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.featured
                  ? "border-foreground shadow-lg"
                  : "bg-background"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                  Most popular
                </div>
              )}

              <h2 className="text-xl font-semibold">{plan.name}</h2>

              <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-8 flex items-end gap-1">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="mb-1 text-sm text-muted-foreground">
                  / month
                </span>
              </div>

              <div className="my-8 border-t" />

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`mt-10 inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-opacity hover:opacity-90 ${
                  plan.featured
                    ? "bg-primary text-primary-foreground"
                    : "border"
                }`}
              >
                {plan.action}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Pricing;
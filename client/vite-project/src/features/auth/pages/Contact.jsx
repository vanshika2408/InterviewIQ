import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data) => {
    console.log("Contact form:", data);
  };

  return (
    <main>
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-medium">CONTACT US</p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              We'd love to hear from you.
            </h1>

            <p className="mt-6 text-lg text-muted-foreground">
              Have a question, suggestion, or something you'd like to tell us?
              Send us a message.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="space-y-8">
            <div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border">
                <Mail className="h-5 w-5" />
              </div>

              <h2 className="text-xl font-semibold">Get in touch</h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We're always looking for ways to make InterviewIQ better.
                Your feedback matters.
              </p>
            </div>

            <div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border">
                <MessageSquare className="h-5 w-5" />
              </div>

              <h2 className="text-xl font-semibold">Questions or feedback?</h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Whether you're reporting an issue or suggesting a feature,
                we'd love to hear from you.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form and we'll get back to you.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>

                    <Input
                      id="name"
                      placeholder="Your name"
                      {...register("name")}
                    />

                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                    />

                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>

                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    {...register("subject")}
                  />

                  {errors.subject && (
                    <p className="text-sm text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>

                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                    {...register("message")}
                    className="flex w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  />

                  {errors.message && (
                    <p className="text-sm text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Send message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default Contact;
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function VerifyEmail() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
            <MailCheck className="h-6 w-6" />
          </div>

          <CardTitle className="text-2xl">
            Check your email
          </CardTitle>

          <CardDescription>
            We've sent a verification link to your email address.
            Click the link to verify your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button className="w-full" variant="outline">
            Resend verification email
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already verified?{" "}
            <Link
              to="/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default VerifyEmail;
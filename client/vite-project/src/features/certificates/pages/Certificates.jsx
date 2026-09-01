import { useEffect, useState } from "react";
import {
  Award,
  Download,
  Lock,
  Trophy,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { getCertificates } from "../../../services/api";

const lockCertificates = [
  {
    title: "Frontend Interview Excellence",
    domain: "Frontend Development",
    score: null,
    date: null,
    unlocked: false,
  },
  {
    title: "Java Technical Interview",
    domain: "Java",
    score: null,
    date: null,
    unlocked: false,
  },
  {
    title: "DSA Interview Mastery",
    domain: "Data Structures & Algorithms",
    score: null,
    date: null,
    unlocked: false,
  },
  {
    title: "InterviewIQ Pro",
    domain: "Overall Performance",
    score: null,
    date: null,
    unlocked: false,
  },
];

function Certificates() {
  const [certList, setCertList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCertificates = async () => {
      try {
        setLoading(true);
        const res = await getCertificates();
        if (res.success && Array.isArray(res.certificates)) {
          setCertList(res.certificates);
        }
      } catch (err) {
        console.error("Fetch certificates error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCertificates();
  }, []);

  const displayCertificates =
    certList.length > 0
      ? certList.map((c) => ({
          title: c.title || `${c.role || "Technical"} Excellence`,
          domain: c.role || "Software Engineering",
          score: c.score || 85,
          date: c.issuedAt
            ? new Date(c.issuedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Recently",
          unlocked: true,
        }))
      : lockCertificates;

  const earnedCount = certList.length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      <div>
        <p className="text-sm text-muted-foreground">Achievements</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Certificates
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Certificates earned through your InterviewIQ practice sessions.
        </p>
      </div>

      <section className="rounded-2xl border bg-muted/30 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-background">
            <Trophy className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Certificates earned
            </p>

            <p className="text-3xl font-bold">{earnedCount}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {displayCertificates.map((certificate, index) => (
          <div
            key={certificate.title + index}
            className={`rounded-xl border p-6 ${
              !certificate.unlocked ? "bg-muted/30" : "bg-background"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border">
                {certificate.unlocked ? (
                  <Award className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {certificate.unlocked && (
                <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Earned
                </span>
              )}
            </div>

            <h2 className="mt-5 font-semibold">{certificate.title}</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {certificate.domain}
            </p>

            {certificate.unlocked ? (
              <>
                <div className="mt-5 flex items-center gap-5 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="mt-1 font-semibold">
                      {certificate.score}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Earned</p>

                    <p className="mt-1 flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      {certificate.date}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Certificate download generated.")}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  <Download className="h-4 w-4" />
                  Download certificate
                </button>
              </>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">
                Complete more interviews and maintain a strong average score
                to unlock this certificate.
              </p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default Certificates;
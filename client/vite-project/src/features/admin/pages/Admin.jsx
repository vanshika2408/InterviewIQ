import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CreditCard,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  getAdminAnalytics,
  getAdminReports,
  getAdminPlans,
  getAdminAIUsage,
  moderateUser,
} from "../../../services/api";

const defaultStats = [
  {
    label: "Total users",
    value: "2,847",
    change: "+12.4%",
    icon: Users,
  },
  {
    label: "AI interviews",
    value: "18,492",
    change: "+8.7%",
    icon: Bot,
  },
  {
    label: "AI usage",
    value: "74.2%",
    change: "+5.1%",
    icon: Activity,
  },
  {
    label: "Active plans",
    value: "1,264",
    change: "+9.3%",
    icon: CreditCard,
  },
];

const defaultReports = [
  {
    title: "Suspicious interview activity",
    user: "User #1842",
    status: "Review",
  },
  {
    title: "Inappropriate content reported",
    user: "User #2017",
    status: "Pending",
  },
  {
    title: "Unusual AI usage detected",
    user: "User #0931",
    status: "Resolved",
  },
];

const defaultUsers = [
  ["Vanshika Mehrotra", "vanshika@example.com", "Pro", "Active"],
  ["Rahul Sharma", "rahul@example.com", "Free", "Active"],
  ["Ananya Singh", "ananya@example.com", "Pro", "Active"],
  ["Arjun Kapoor", "arjun@example.com", "Free", "Suspended"],
];

function Admin() {
  const [adminData, setAdminData] = useState(null);
  const [reportsList, setReportsList] = useState(defaultReports);
  const [plansList, setPlansList] = useState([]);
  const [aiUsage, setAiUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setLoading(true);
        const [analyticsRes, reportsRes, plansRes, aiRes] = await Promise.allSettled([
          getAdminAnalytics(),
          getAdminReports(),
          getAdminPlans(),
          getAdminAIUsage(),
        ]);

        if (analyticsRes.status === "fulfilled" && analyticsRes.value.success) {
          setAdminData(analyticsRes.value);
        }
        if (reportsRes.status === "fulfilled" && reportsRes.value.reports) {
          setReportsList(reportsRes.value.reports);
        }
        if (plansRes.status === "fulfilled" && plansRes.value.plans) {
          setPlansList(plansRes.value.plans);
        }
        if (aiRes.status === "fulfilled" && aiRes.value.usage) {
          setAiUsage(aiRes.value.usage);
        }
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  const stats = [
    {
      label: "Total users",
      value: adminData?.totalUsers ? adminData.totalUsers.toLocaleString() : "2,847",
      change: "+12.4%",
      icon: Users,
    },
    {
      label: "AI interviews",
      value: adminData?.totalInterviews ? adminData.totalInterviews.toLocaleString() : "18,492",
      change: "+8.7%",
      icon: Bot,
    },
    {
      label: "AI usage",
      value: aiUsage?.usageRate ? `${aiUsage.usageRate}%` : "74.2%",
      change: "+5.1%",
      icon: Activity,
    },
    {
      label: "Active plans",
      value: adminData?.activePlans ? adminData.activePlans.toLocaleString() : "1,264",
      change: "+9.3%",
      icon: CreditCard,
    },
  ];

  const userTable =
    adminData?.recentUsers?.length > 0
      ? adminData.recentUsers.map((u) => [
          `${u.firstName || "User"} ${u.lastName || ""}`.trim(),
          u.email,
          u.role === "admin" ? "Admin" : u.subscription || "Free",
          u.isBanned ? "Suspended" : "Active",
          u._id,
        ])
      : defaultUsers;

  const handleModerate = async (userId, action) => {
    try {
      await moderateUser({ userId, action });
      alert(`User ${action} successfully.`);
    } catch (err) {
      console.error("User moderation error:", err);
      alert(err.message || "Action failed.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Administration</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Admin dashboard
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Monitor users, AI usage, reports, and platform activity.
        </p>
      </div>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border">
                  <Icon className="h-4 w-4" />
                </div>

                <span className="text-xs text-muted-foreground">
                  {stat.change}
                </span>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                {stat.label}
              </p>

              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </section>

      {/* Platform overview */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <Bot className="h-5 w-5" />

            <div>
              <h2 className="font-semibold">AI usage</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Current platform AI consumption.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Monthly usage
              </span>

              <span className="font-medium">{aiUsage?.usageRate || "74.2"}%</span>
            </div>

            <div className="mt-3 h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-foreground transition-all"
                style={{ width: `${aiUsage?.usageRate || 74}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Interviews</p>
              <p className="mt-1 font-semibold">{aiUsage?.totalInterviews || "18.4K"}</p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Tokens</p>
              <p className="mt-1 font-semibold">{aiUsage?.tokens || "2.8M"}</p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Avg. cost</p>
              <p className="mt-1 font-semibold">{aiUsage?.avgCost || "$0.08"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5" />

            <div>
              <h2 className="font-semibold">Plans</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Current subscription distribution.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {(plansList.length > 0
              ? plansList
              : [
                  ["Free", "1,583", "56%"],
                  ["Pro", "1,012", "36%"],
                  ["Premium", "252", "8%"],
                ]
            ).map(([name, count, percentage]) => (
              <div key={name}>
                <div className="flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="text-muted-foreground">
                    {count} · {percentage}
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-foreground transition-all"
                    style={{ width: percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Users */}
      <section className="rounded-xl border">
        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5" />

            <div>
              <h2 className="font-semibold">Recent users</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Recently active platform users.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {userTable.map(([name, email, plan, status, id]) => (
                <tr key={email} className="border-b last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-medium">{name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {email}
                    </p>
                  </td>

                  <td className="px-6 py-4">{plan}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs ${
                        status === "Active"
                          ? "text-emerald-600 border-emerald-500/20 bg-emerald-500/10"
                          : "text-destructive border-destructive/20 bg-destructive/10"
                      }`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleModerate(id, status === "Active" ? "suspend" : "activate")}
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      {status === "Active" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reports */}
      <section className="rounded-xl border">
        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />

            <div>
              <h2 className="font-semibold">Moderation reports</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Reports requiring administrator attention.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {reportsList.map((report, idx) => (
            <div
              key={report.title || idx}
              className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                  <p className="text-sm font-medium">{report.title}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {report.user || report.reportedUser || "User"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-medium">
                  {report.status || "Review"}
                </span>

                <button
                  type="button"
                  onClick={() => alert(`Reviewing report: ${report.title}`)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Admin;
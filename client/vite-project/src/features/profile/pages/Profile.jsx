import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import ProfileHeader from "../components/ProfileHeader";
import ProfileForm from "../components/ProfileForm";
import { getProfile } from "../../../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        if (res.success && res.user) {
          setUser(res.user);
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const headerProfile = {
    firstName: user?.firstName || "User",
    lastName: user?.lastName || "",
    email: user?.email || "",
    location: user?.profile?.location || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills || [],
    education: user?.profile?.education || "",
    university: user?.profile?.university || "",
  };

  const completion = Math.min(
    100,
    Math.round(
      [
        headerProfile.firstName,
        headerProfile.lastName,
        headerProfile.email,
        headerProfile.location,
        headerProfile.bio,
        headerProfile.skills.length > 0,
        headerProfile.education,
        headerProfile.university,
      ].filter(Boolean).length * 12.5
    )
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Account</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Profile
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal information and professional profile.
        </p>
      </div>

      <ProfileHeader profile={headerProfile} />

      {/* Profile completion */}
      <section className="rounded-xl border bg-muted/30 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold">Profile completion</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Complete your profile to get more personalized interviews.
                </p>
              </div>

              <span className="text-sm font-semibold">
                {completion}%
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <ProfileForm
        profileData={user}
        onProfileUpdated={(updatedUser) => setUser(updatedUser)}
      />
    </div>
  );
}

export default Profile;
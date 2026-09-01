import { Camera, Mail, MapPin } from "lucide-react";

function ProfileHeader({ profile }) {
  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`;

  return (
    <section className="rounded-xl border bg-background p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border bg-muted text-2xl font-semibold">
            {initials}
          </div>

          <button
            type="button"
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted"
            aria-label="Change profile photo"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.firstName} {profile.lastName}
          </h1>

          <p className="text-sm text-muted-foreground">
            Computer Science Student
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              {profile.email}
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileHeader;
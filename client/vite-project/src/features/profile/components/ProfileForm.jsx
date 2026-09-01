import { Check, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { updateProfile } from "../../../services/api";

function ProfileForm({ profileData, onProfileUpdated }) {
  const [form, setForm] = useState({
    firstName: profileData?.firstName || "",
    lastName: profileData?.lastName || "",
    email: profileData?.email || "",
    location: profileData?.profile?.location || "",
    bio: profileData?.profile?.bio || "",
    skills: profileData?.profile?.skills || [],
    education: profileData?.profile?.education || "",
    university: profileData?.profile?.university || "",
  });

  useEffect(() => {
    if (profileData) {
      setForm({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        location: profileData.profile?.location || "",
        bio: profileData.profile?.bio || "",
        skills: profileData.profile?.skills || [],
        education: profileData.profile?.education || "",
        university: profileData.profile?.university || "",
      });
    }
  }, [profileData]);

  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const alreadyExists = form.skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setForm((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }));

    setSkillInput("");
    setSaved(false);
  };

  const removeSkill = (skillToRemove) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));

    setSaved(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm() || loading) {
      setSaved(false);
      return;
    }

    setLoading(true);
    setSaved(false);

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        profile: {
          location: form.location,
          bio: form.bio,
          skills: form.skills,
          education: form.education,
          university: form.university,
        },
      };

      const res = await updateProfile(payload);
      if (res.success && res.user) {
        setSaved(true);
        if (onProfileUpdated) onProfileUpdated(res.user);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setErrors({ submit: err.message || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring ${
      errors[field] ? "border-destructive" : ""
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {errors.submit}
        </div>
      )}

      {/* Personal information */}
      <section className="rounded-xl border bg-background p-6">
        <div>
          <h2 className="font-semibold">Personal information</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Keep your basic profile information up to date.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              First name
            </label>

            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass("firstName")}
            />

            {errors.firstName && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Last name
            </label>

            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={inputClass("lastName")}
            />

            {errors.lastName && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.lastName}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <input
              name="email"
              type="email"
              disabled
              value={form.email}
              className={`${inputClass("email")} opacity-60 cursor-not-allowed`}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Location
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass("location")}
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium">Bio</label>

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            maxLength={300}
            className="mt-2 w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />

          <div className="mt-1 flex justify-end text-xs text-muted-foreground">
            {form.bio.length}/300
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="rounded-xl border bg-background p-6">
        <div>
          <h2 className="font-semibold">Skills</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add the technologies and skills you want InterviewIQ
            to consider.
          </p>
        </div>

        {form.skills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs"
              >
                {skill}

                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <input
            value={skillInput}
            onChange={(event) => setSkillInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSkill();
              }
            }}
            placeholder="e.g. Docker"
            className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />

          <button
            type="button"
            onClick={addSkill}
            disabled={!skillInput.trim()}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </section>

      {/* Education */}
      <section className="rounded-xl border bg-background p-6">
        <div>
          <h2 className="font-semibold">Education</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add your latest educational background.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              Degree
            </label>

            <input
              name="education"
              value={form.education}
              onChange={handleChange}
              className={inputClass("education")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              University
            </label>

            <input
              name="university"
              value={form.university}
              onChange={handleChange}
              className={inputClass("university")}
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <p className="flex items-center gap-1.5 text-sm text-emerald-600">
            <Check className="h-4 w-4" />
            Profile updated successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
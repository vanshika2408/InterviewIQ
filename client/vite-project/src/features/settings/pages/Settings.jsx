import { useEffect, useState } from "react";
import {
  Bell,
  Moon,
  Shield,
  Trash2,
  Volume2,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Clock,
  TrendingUp,
} from "lucide-react";

import SettingSection from "../components/SettingSection";
import {
  changePassword,
  getUserSettings,
  updateUserSettings,
  sendTestEmail,
} from "../../../services/api";
import soundFx from "../../../utils/sound";

const getActiveThemeDark = () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") return true;
  if (storedTheme === "light") return false;
  return document.documentElement.classList.contains("dark");
};

function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    interviewReminders: true,
    weeklyProgress: true,
    soundEffects: soundFx.isSoundEnabled(),
    darkMode: getActiveThemeDark(),
  });

  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailMsg, setTestEmailMsg] = useState(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const activeIsDark = getActiveThemeDark();

      try {
        setLoadingSettings(true);
        const res = await getUserSettings();
        if (res.success && res.settings) {
          const storedTheme = localStorage.getItem("theme");
          const effectiveDarkMode =
            storedTheme !== null
              ? storedTheme === "dark"
              : typeof res.settings.darkMode === "boolean"
              ? res.settings.darkMode
              : activeIsDark;

          const apiSettings = {
            emailNotifications: res.settings.emailNotifications ?? true,
            interviewReminders: res.settings.interviewReminders ?? true,
            weeklyProgress: res.settings.weeklyProgress ?? true,
            soundEffects: res.settings.soundEffects ?? soundFx.isSoundEnabled(),
            darkMode: effectiveDarkMode,
          };

          setSettings(apiSettings);

          // Apply theme
          if (effectiveDarkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          soundFx.setSoundEnabled(apiSettings.soundEffects);
        }
      } catch (err) {
        console.warn("Failed to fetch settings from server, falling back to local state:", err);
        const isSound = localStorage.getItem("soundEffects") !== "false";
        const isEmail = localStorage.getItem("emailNotifications") !== "false";
        const isRemind = localStorage.getItem("interviewReminders") !== "false";
        const isWeekly = localStorage.getItem("weeklyProgress") !== "false";

        setSettings({
          darkMode: activeIsDark,
          soundEffects: isSound,
          emailNotifications: isEmail,
          interviewReminders: isRemind,
          weeklyProgress: isWeekly,
        });
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSetting = (key) => {
    setSettings((current) => {
      const nextValue = !current[key];

      // Handle live Dark Mode toggle
      if (key === "darkMode") {
        if (nextValue) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }

      // Handle live Sound Effects toggle
      if (key === "soundEffects") {
        soundFx.setSoundEnabled(nextValue);
      }

      // Save key preference locally
      localStorage.setItem(key, nextValue ? "true" : "false");

      // Play audio feedback chime
      soundFx.playToggleSound(nextValue);

      return {
        ...current,
        [key]: nextValue,
      };
    });

    setSaveMsg(null);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveMsg(null);

    // Save locally
    Object.keys(settings).forEach((key) => {
      localStorage.setItem(key, settings[key] ? "true" : "false");
    });

    try {
      const res = await updateUserSettings(settings);
      if (res.success) {
        setSaveMsg({ text: "Settings saved to your account successfully!", isError: false });
        soundFx.playSuccessSound();
      }
    } catch (err) {
      console.error("Error saving settings to DB:", err);
      setSaveMsg({ text: err.message || "Saved locally, but failed to sync to cloud.", isError: true });
    } finally {
      setSaveLoading(false);
      setTimeout(() => setSaveMsg(null), 4000);
    }
  };

  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailMsg(null);

    try {
      const res = await sendTestEmail();
      if (res.success) {
        setTestEmailMsg({
          text: res.message,
          isError: false,
          simulated: res.simulated,
        });
        soundFx.playSuccessSound();
      }
    } catch (err) {
      console.error("Test email error:", err);
      setTestEmailMsg({
        text: err.message || "Failed to send test email.",
        isError: true,
      });
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    setPassLoading(true);

    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordMsg({ text: "Password changed successfully!", isError: false });
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => setShowPasswordForm(false), 2000);
      }
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordMsg({ text: err.message || "Failed to change password.", isError: true });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">Account Preferences</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your InterviewIQ preferences, notification rules, sound effects, and security settings.
        </p>
      </div>

      {loadingSettings && (
        <div className="flex items-center gap-2 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading your saved preferences...
        </div>
      )}

      {/* Notifications */}
      <SettingSection
        title="Notifications & Mail Settings"
        description="Choose what events trigger email notifications and practice reminders."
      >
        <div className="space-y-6">
          <ToggleRow
            icon={Bell}
            title="Email notifications"
            description="Receive important updates, status reports, and system notifications via email."
            enabled={settings.emailNotifications}
            onToggle={() => updateSetting("emailNotifications")}
          />

          <ToggleRow
            icon={Clock}
            title="Interview reminders"
            description="Get automated email reminders for scheduled practice sessions and mock interviews."
            enabled={settings.interviewReminders}
            onToggle={() => updateSetting("interviewReminders")}
          />

          <ToggleRow
            icon={TrendingUp}
            title="Weekly progress report"
            description="Receive a weekly breakdown of your completed practice, XP gained, and performance scores."
            enabled={settings.weeklyProgress}
            onToggle={() => updateSetting("weeklyProgress")}
          />

          {/* Test Email Action Card */}
          <div className="mt-4 rounded-xl border bg-muted/30 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg border bg-background p-2.5 shadow-sm text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Test Mail Delivery</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Send a test notification to verify your email inbox & service integration.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={testEmailLoading}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {testEmailLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Sending Test...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send Test Email
                  </>
                )}
              </button>
            </div>

            {testEmailMsg && (
              <div
                className={`mt-4 flex items-start gap-2.5 rounded-lg border p-3 text-xs ${
                  testEmailMsg.isError
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {testEmailMsg.isError ? (
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{testEmailMsg.text}</p>
                  {testEmailMsg.simulated && (
                    <p className="mt-1 text-[11px] opacity-85">
                      💡 Dev Note: Simulated mode active because SMTP server credentials are not configured in backend .env.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </SettingSection>

      {/* Interview Preferences */}
      <SettingSection
        title="Interview & Audio Preferences"
        description="Customize sound effects and feedback chimes during interview interactions."
      >
        <ToggleRow
          icon={Volume2}
          title="Sound effects & Audio feedback"
          description="Play audio feedback chimes for answer submission, level up, daily challenges, and toggles."
          enabled={settings.soundEffects}
          onToggle={() => updateSetting("soundEffects")}
        />
      </SettingSection>

      {/* Appearance */}
      <SettingSection
        title="Appearance"
        description="Control how InterviewIQ looks on your device."
      >
        <ToggleRow
          icon={Moon}
          title="Dark mode"
          description="Use a dark background theme optimized for low-light environments."
          enabled={settings.darkMode}
          onToggle={() => updateSetting("darkMode")}
        />
      </SettingSection>

      {/* Security */}
      <SettingSection
        title="Security & Account"
        description="Manage password credentials and account security."
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium">Password</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Change your current account password.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPasswordForm((show) => !show)}
              className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              {showPasswordForm ? "Cancel" : "Change password"}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="mt-4 space-y-4 rounded-lg border bg-muted/20 p-4">
              {passwordMsg && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    passwordMsg.isError
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  }`}
                >
                  {passwordMsg.isError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  {passwordMsg.text}
                </div>
              )}
              <div>
                <label className="text-xs font-medium">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                disabled={passLoading}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {passLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </SettingSection>

      {/* Danger zone */}
      <section className="rounded-xl border border-destructive/40 bg-background">
        <div className="border-b border-destructive/20 p-6">
          <h2 className="font-semibold text-destructive">Danger zone</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Permanently delete your InterviewIQ account and associated data.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Delete account</p>

            <p className="mt-1 text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-destructive px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
        </div>
      </section>

      {/* Save bar */}
      <div className="flex items-center justify-end gap-4 border-t pt-6">
        {saveMsg && (
          <p
            className={`text-sm font-medium flex items-center gap-1.5 ${
              saveMsg.isError ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {saveMsg.isError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            {saveMsg.text}
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saveLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
        >
          {saveLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />}

        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
          enabled
            ? "bg-primary border-primary"
            : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-background transition-transform shadow-sm ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default Settings;
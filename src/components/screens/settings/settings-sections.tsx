import type { ReactNode } from "react";
import {
  Bell,
  Building2,
  Globe,
  Mail,
  MapPin,
  Palette,
  Phone,
  Shield
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function CompanyProfileCard() {
  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h2 className="mb-6">Company Profile</h2>
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-info/10 text-2xl text-info">T</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm">
              Upload Logo
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">Recommended: 400x400px, PNG or JPG</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProfileInput
            id="companyName"
            label="Company Name"
            icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
            defaultValue="TechCorp Inc."
          />
          <ProfileInput
            id="website"
            label="Website"
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
            defaultValue="https://techcorp.com"
          />
          <ProfileInput
            id="email"
            label="Contact Email"
            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
            defaultValue="contact@techcorp.com"
          />
          <ProfileInput
            id="phone"
            label="Phone"
            icon={<Phone className="h-4 w-4 text-muted-foreground" />}
            defaultValue="+1 (555) 987-6543"
          />

          <div className="md:col-span-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="location" defaultValue="123 Tech Street, San Francisco, CA 94105" className="pl-10" />
            </div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              defaultValue="We're building the future of work with innovative technology solutions..."
              className="mt-2 min-h-[100px]"
            />
          </div>
        </div>

        <Button>Save Changes</Button>
      </div>
    </MotionCard>
  );
}

export function NotificationsCard() {
  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <div className="mb-6 flex items-center gap-2">
        <Bell className="h-5 w-5" />
        <h2 className="text-xl font-bold">Notifications</h2>
      </div>
      <div className="space-y-4">
        <NotificationSetting
          label="New Applications"
          description="Get notified when someone applies to your jobs"
          defaultChecked
        />
        <Separator />
        <NotificationSetting
          label="Performance Alerts"
          description="Receive alerts about job performance and optimization tips"
          defaultChecked
        />
        <Separator />
        <NotificationSetting
          label="Boost Campaign Updates"
          description="Get updates about your sponsored campaigns"
          defaultChecked
        />
        <Separator />
        <NotificationSetting
          label="Weekly Reports"
          description="Receive weekly analytics summaries via email"
          defaultChecked={false}
        />
        <Separator />
        <NotificationSetting
          label="Marketing Updates"
          description="Get news and updates about Lynq platform"
          defaultChecked={false}
        />
      </div>
    </MotionCard>
  );
}

interface AppearanceCardProps {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
}

export function AppearanceCard({ isDark, onThemeChange }: AppearanceCardProps) {
  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <div className="mb-6 flex items-center gap-2">
        <Palette className="h-5 w-5" />
        <h2 className="text-xl font-bold">Appearance</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-muted-foreground">{isDark ? "Dark mode is enabled" : "Light mode is enabled"}</p>
          </div>
          <Switch checked={isDark} onCheckedChange={onThemeChange} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Compact View</p>
            <p className="text-sm text-muted-foreground">Show more content on screen</p>
          </div>
          <Switch />
        </div>
      </div>
    </MotionCard>
  );
}

export function SecurityCard() {
  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <div className="mb-6 flex items-center gap-2">
        <Shield className="h-5 w-5" />
        <h2 className="text-xl font-bold">Security</h2>
      </div>
      <div className="space-y-4">
        <SecurityAction
          title="Two-Factor Authentication"
          description="Add an extra layer of security"
          action="Enable"
        />
        <Separator />
        <SecurityAction title="Change Password" description="Update your password regularly" action="Change" />
        <Separator />
        <SecurityAction
          title="Active Sessions"
          description="Manage devices logged into your account"
          action="Manage"
        />
      </div>
    </MotionCard>
  );
}

export function DangerZoneCard() {
  return (
    <MotionCard className="rounded-[22px] border border-danger/20 bg-danger/5 p-5">
      <h2 className="mb-4 text-danger">Danger Zone</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Delete Account</p>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
          </div>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      </div>
    </MotionCard>
  );
}

function ProfileInput({
  id,
  label,
  icon,
  defaultValue
}: {
  id: string;
  label: string;
  icon: ReactNode;
  defaultValue: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-2">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        <Input id={id} defaultValue={defaultValue} className="pl-10" />
      </div>
    </div>
  );
}

function NotificationSetting({
  label,
  description,
  defaultChecked
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function SecurityAction({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="outline" size="sm">
        {action}
      </Button>
    </div>
  );
}

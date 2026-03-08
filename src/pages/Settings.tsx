import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <Card className="glass border-border/50">
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input defaultValue="Alex" className="bg-secondary/50" /></div>
            <div><Label>Last Name</Label><Input defaultValue="Johnson" className="bg-secondary/50" /></div>
          </div>
          <div><Label>Email</Label><Input defaultValue="alex@example.com" className="bg-secondary/50" /></div>
          <Button className="gradient-primary text-primary-foreground">Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            ["Unusual spending alerts", true],
            ["Budget exceeded warnings", true],
            ["Debt payment reminders", true],
            ["Investment opportunities", false],
            ["AI-generated summaries", true],
          ].map(([label, defaultVal]) => (
            <div key={label as string} className="flex items-center justify-between">
              <Label>{label as string}</Label>
              <Switch defaultChecked={defaultVal as boolean} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader><CardTitle className="text-base">AI Assistant (Ollama)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Ollama API URL</Label><Input defaultValue="http://localhost:11434" className="bg-secondary/50" /></div>
          <div><Label>Model</Label><Input defaultValue="llama3" className="bg-secondary/50" /></div>
          <Button className="gradient-primary text-primary-foreground">Test Connection</Button>
        </CardContent>
      </Card>
    </div>
  );
}

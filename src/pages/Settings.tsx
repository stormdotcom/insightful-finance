import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences.</p>
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
        <CardHeader><CardTitle className="text-base">Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Currency</Label>
            <Select defaultValue="INR">
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Monthly Budget Reset Day</Label>
            <Select defaultValue="1">
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st of month</SelectItem>
                <SelectItem value="15">15th of month</SelectItem>
                <SelectItem value="salary">Salary day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            ["Unusual spending alerts", true],
            ["Budget exceeded warnings", true],
            ["EMI payment reminders", true],
            ["Weekly spending summary", false],
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

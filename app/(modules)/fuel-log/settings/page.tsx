"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Calculator,
  Database,
  DollarSign,
  Download,
  Fuel,
  Globe,
  Moon,
  Palette,
  Save,
  Settings as SettingsIcon,
  Shield,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";

interface UserSettings {
  profile: {
    name: string;
    email: string;
    location: string;
    timezone: string;
  };
  preferences: {
    currency: string;
    distanceUnit: string;
    volumeUnit: string;
    fuelPriceUnit: string;
    defaultView: string;
    dateFormat: string;
    theme: string;
  };
  notifications: {
    emailNotifications: boolean;
    maintenanceReminders: boolean;
    lowMileageAlerts: boolean;
    weeklyReports: boolean;
    fuelPriceAlerts: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    locationTracking: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      location: "Mumbai, Maharashtra",
      timezone: "Asia/Kolkata",
    },
    preferences: {
      currency: "INR",
      distanceUnit: "km",
      volumeUnit: "liters",
      fuelPriceUnit: "per_liter",
      defaultView: "dashboard",
      dateFormat: "DD/MM/YYYY",
      theme: "system",
    },
    notifications: {
      emailNotifications: true,
      maintenanceReminders: true,
      lowMileageAlerts: false,
      weeklyReports: true,
      fuelPriceAlerts: true,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      locationTracking: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportData = async () => {
    // Simulate data export
    const data = {
      vehicles: [],
      fuelLogs: [],
      serviceRecords: [],
      settings: settings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fuel-tracker-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateSettings = (
    section: keyof UserSettings,
    field: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-8 p-4 sm:p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900 to-cyan-950 rounded-2xl p-8 text-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
                  <SettingsIcon className="h-8 w-8" />
                  Settings
                </h1>
                <p className="text-indigo-100 text-base sm:text-lg">
                  Customize your fuel tracking experience
                </p>
              </div>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm h-12 px-6 self-start sm:self-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saved ? "Saved!" : loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* App Preferences */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                App Preferences
              </CardTitle>
              <CardDescription>
                Customize units, display format, and app behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={settings.preferences.currency}
                    onValueChange={(value) =>
                      updateSettings("preferences", "currency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">৳ Indian Rupee</SelectItem>
                      <SelectItem value="USD">$ US Dollar</SelectItem>
                      <SelectItem value="EUR">€ Euro</SelectItem>
                      <SelectItem value="GBP">£ British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Distance Unit</Label>
                  <Select
                    value={settings.preferences.distanceUnit}
                    onValueChange={(value) =>
                      updateSettings("preferences", "distanceUnit", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers</SelectItem>
                      <SelectItem value="miles">Miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Volume Unit</Label>
                  <Select
                    value={settings.preferences.volumeUnit}
                    onValueChange={(value) =>
                      updateSettings("preferences", "volumeUnit", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liters">Liters</SelectItem>
                      <SelectItem value="gallons">Gallons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={settings.preferences.dateFormat}
                    onValueChange={(value) =>
                      updateSettings("preferences", "dateFormat", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default View</Label>
                  <Select
                    value={settings.preferences.defaultView}
                    onValueChange={(value) =>
                      updateSettings("preferences", "defaultView", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="fuel-entries">Fuel Entries</SelectItem>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                      <SelectItem value="reports">Reports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Theme</Label>
                    <p className="text-xs text-muted-foreground">
                      Choose your preferred color theme
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={
                        settings.preferences.theme === "light"
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      onClick={() =>
                        updateSettings("preferences", "theme", "light")
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Sun className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        settings.preferences.theme === "dark"
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      onClick={() =>
                        updateSettings("preferences", "theme", "dark")
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Moon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        settings.preferences.theme === "system"
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      onClick={() =>
                        updateSettings("preferences", "theme", "system")
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-500" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure when and how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "emailNotifications",
                  title: "Email Notifications",
                  description: "Receive notifications via email",
                },
                {
                  key: "maintenanceReminders",
                  title: "Maintenance Reminders",
                  description: "Get notified when vehicle service is due",
                },
                {
                  key: "lowMileageAlerts",
                  title: "Low Mileage Alerts",
                  description: "Alert when fuel efficiency drops significantly",
                },
                {
                  key: "weeklyReports",
                  title: "Weekly Reports",
                  description: "Receive weekly fuel consumption summaries",
                },
                {
                  key: "fuelPriceAlerts",
                  title: "Fuel Price Alerts",
                  description: "Notify when fuel prices change in your area",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">{item.title}</Label>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={
                      settings.notifications[
                        item.key as keyof typeof settings.notifications
                      ]
                    }
                    onCheckedChange={(checked) =>
                      updateSettings("notifications", item.key, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your data privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "dataSharing",
                  title: "Data Sharing",
                  description:
                    "Share anonymous usage data to help improve the app",
                },
                {
                  key: "analytics",
                  title: "Analytics",
                  description:
                    "Allow collection of analytics data for app optimization",
                },
                {
                  key: "locationTracking",
                  title: "Location Tracking",
                  description:
                    "Enable location services for fuel station suggestions",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">{item.title}</Label>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={
                      settings.privacy[
                        item.key as keyof typeof settings.privacy
                      ]
                    }
                    onCheckedChange={(checked) =>
                      updateSettings("privacy", item.key, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-500" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export, import, or delete your fuel tracking data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Export Data
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                    Download all your fuel logs, vehicles, and settings as a
                    JSON file
                  </p>
                  <Button
                    onClick={handleExportData}
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Import Data
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                    Restore your data from a previously exported JSON file
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                  Delete All Data
                </h4>
                <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                  Permanently delete all your fuel logs, vehicles, and account
                  data. This action cannot be undone.
                </p>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fuel Calculator Settings */}
          <Card className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 border-teal-200/50 dark:border-teal-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                <Calculator className="h-5 w-5" />
                Fuel Calculator Defaults
              </CardTitle>
              <CardDescription>
                Set default values for quick calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultFuelPrice">
                    Default Fuel Price (per L)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="defaultFuelPrice"
                      type="number"
                      step="0.01"
                      placeholder="102.50"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultTankCapacity">
                    Default Tank Capacity (L)
                  </Label>
                  <div className="relative">
                    <Fuel className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="defaultTankCapacity"
                      type="number"
                      placeholder="45"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success message */}
          {saved && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
              <Save className="h-4 w-4" />
              Settings saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

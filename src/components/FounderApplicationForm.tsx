import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Rocket, Send, CheckCircle2 } from "lucide-react";

interface FounderApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFeatureType?: "founder_story" | "rising_founder";
}

const stages = [
  { value: "idea", label: "Idea Stage" },
  { value: "mvp", label: "MVP" },
  { value: "pre_seed", label: "Pre-seed" },
  { value: "seed", label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b_plus", label: "Series B+" },
  { value: "profitable", label: "Profitable" },
];

const fundingTypes = [
  { value: "bootstrapped", label: "Bootstrapped" },
  { value: "angel", label: "Angel Investment" },
  { value: "vc", label: "Venture Capital" },
  { value: "grant", label: "Grant" },
  { value: "mixed", label: "Mixed" },
];

const industries = [
  "Gaming", "Healthcare", "Biotech", "Fintech", "E-Commerce",
  "EdTech", "Consultancy", "SaaS", "AI", "Travel & Tourism",
  "Logistics", "Real Estate", "Food & Beverage", "Other",
];

const FounderApplicationForm = ({
  open,
  onOpenChange,
  defaultFeatureType = "rising_founder",
}: FounderApplicationFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isIncubated, setIsIncubated] = useState(false);
  const [cofounders, setCofounders] = useState<{ name: string; age: string; education: string }[]>([]);

  const [form, setForm] = useState({
    founder_name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    linkedin_url: "",
    age: "",
    gender: "",
    education: "",
    company_name: "",
    company_website: "",
    industry: "",
    one_liner: "",
    num_cofounders: "1",
    founded_date: "",
    stage: "",
    incubator_name: "",
    funding_amount: "",
    funding_type: "",
    grants_received: "",
    team_size: "",
    revenue: "",
    social_media: "",
    feature_type: defaultFeatureType,
    message: "",
  });

  const handleCofounderCountChange = (value: string) => {
    update("num_cofounders", value);
    const count = parseInt(value) || 1;
    const extraCount = Math.max(0, count - 1);
    setCofounders((prev) => {
      const updated = [...prev];
      while (updated.length < extraCount) updated.push({ name: "", age: "", education: "" });
      return updated.slice(0, extraCount);
    });
  };

  const updateCofounder = (index: number, field: string, value: string) => {
    setCofounders((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.founder_name || !form.email || !form.company_name || !form.stage || !form.industry || !form.one_liner || !form.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const filteredCofounders = cofounders.filter((c) => c.name.trim());
    const { error } = await supabase.from("founder_applications" as any).insert({
      founder_name: form.founder_name,
      email: form.email,
      phone: form.phone || null,
      country: form.country,
      city: form.city || null,
      linkedin_url: form.linkedin_url || null,
      age: form.age || null,
      gender: form.gender || null,
      education: form.education || null,
      company_name: form.company_name,
      company_website: form.company_website || null,
      industry: form.industry,
      one_liner: form.one_liner,
      num_cofounders: parseInt(form.num_cofounders) || 1,
      founded_date: form.founded_date || null,
      stage: form.stage,
      is_incubated: isIncubated,
      incubator_name: isIncubated ? form.incubator_name || null : null,
      funding_amount: form.funding_amount || null,
      funding_type: form.funding_type || null,
      grants_received: form.grants_received || null,
      team_size: form.team_size || null,
      revenue: form.revenue || null,
      social_media: form.social_media || null,
      feature_type: form.feature_type,
      message: form.message || null,
      cofounder_details: filteredCofounders.length > 0 ? filteredCofounders : null,
    } as any);

    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => {
      setSubmitted(false);
      setForm({
        founder_name: "", email: "", phone: "", country: "", city: "",
        linkedin_url: "", age: "", gender: "", education: "",
        company_name: "", company_website: "", industry: "",
        one_liner: "", num_cofounders: "1", founded_date: "", stage: "",
        incubator_name: "", funding_amount: "", funding_type: "",
        grants_received: "", team_size: "", revenue: "", social_media: "",
        feature_type: defaultFeatureType, message: "",
      });
      setIsIncubated(false);
      setCofounders([]);
    }, 300);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Application Submitted!</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Thank you for sharing your story. We'll review your application and reach out if you're a fit for our feature.
            </p>
            <Button onClick={handleClose} className="mt-6">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Get Featured
          </DialogTitle>
          <DialogDescription>
            Tell us about yourself and your startup. We'll review and reach out.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          {/* Feature Type */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feature In</Label>
            <div className="flex gap-2">
              {[
                { value: "rising_founder", label: "Rising Founders" },
                { value: "founder_story", label: "Founder Story" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("feature_type", opt.value)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                    form.feature_type === opt.value
                      ? "gradient-bg text-primary-foreground border-transparent"
                      : "bg-muted/50 text-muted-foreground border-border hover:border-primary/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: About You */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">About You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="founder_name" className="text-sm">Full Name *</Label>
                <Input id="founder_name" value={form.founder_name} onChange={(e) => update("founder_name", e.target.value)} placeholder="Your name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+966..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linkedin_url" className="text-sm">LinkedIn</Label>
                <Input id="linkedin_url" value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} placeholder="linkedin.com/in/..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country" className="text-sm">Country *</Label>
                <Input id="country" value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Saudi Arabia" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-sm">City</Label>
                <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Riyadh" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="age" className="text-sm">Age</Label>
                <Input id="age" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="e.g. 28" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-sm">Gender</Label>
                <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                  <SelectTrigger id="gender"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["Male", "Female"].map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="education" className="text-sm">Education</Label>
                <Input id="education" value={form.education} onChange={(e) => update("education", e.target.value)} placeholder="e.g. BSc Computer Science, KAUST" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="space-y-1.5">
                <Label htmlFor="num_cofounders" className="text-sm">How many founders in total?</Label>
                <Select value={form.num_cofounders} onValueChange={handleCofounderCountChange}>
                  <SelectTrigger id="num_cofounders"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4", "5"].map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {cofounders.length > 0 && (
              <div className="space-y-4 mt-4">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Co-founder Details</Label>
                {cofounders.map((cofounder, i) => (
                  <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium text-foreground">Co-founder {i + 1}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`cofounder_name_${i}`} className="text-sm">Name</Label>
                        <Input
                          id={`cofounder_name_${i}`}
                          value={cofounder.name}
                          onChange={(e) => updateCofounder(i, "name", e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`cofounder_age_${i}`} className="text-sm">Age</Label>
                        <Input
                          id={`cofounder_age_${i}`}
                          value={cofounder.age}
                          onChange={(e) => updateCofounder(i, "age", e.target.value)}
                          placeholder="e.g. 28"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`cofounder_edu_${i}`} className="text-sm">Education</Label>
                        <Input
                          id={`cofounder_edu_${i}`}
                          value={cofounder.education}
                          onChange={(e) => updateCofounder(i, "education", e.target.value)}
                          placeholder="e.g. MBA, KAUST"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Your Startup */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Your Startup</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="company_name" className="text-sm">Company Name *</Label>
                <Input id="company_name" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} placeholder="Your startup" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company_website" className="text-sm">Website</Label>
                <Input id="company_website" value={form.company_website} onChange={(e) => update("company_website", e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="industry" className="text-sm">Industry *</Label>
                <Select value={form.industry} onValueChange={(v) => update("industry", v)}>
                  <SelectTrigger id="industry"><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="one_liner" className="text-sm">One-liner Description *</Label>
                <Input id="one_liner" value={form.one_liner} onChange={(e) => update("one_liner", e.target.value)} placeholder="What does your startup do in one sentence?" required maxLength={200} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="founded_date" className="text-sm">Founded</Label>
                <Input id="founded_date" value={form.founded_date} onChange={(e) => update("founded_date", e.target.value)} placeholder="e.g. Jan 2024" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stage" className="text-sm">Stage *</Label>
                <Select value={form.stage} onValueChange={(v) => update("stage", v)}>
                  <SelectTrigger id="stage"><SelectValue placeholder="Select stage" /></SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="team_size" className="text-sm">Total Team Size</Label>
                <Input id="team_size" value={form.team_size} onChange={(e) => update("team_size", e.target.value)} placeholder="e.g. 5" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="revenue" className="text-sm">Monthly Revenue</Label>
                <Input id="revenue" value={form.revenue} onChange={(e) => update("revenue", e.target.value)} placeholder="e.g. $5K, Pre-revenue" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="social_media" className="text-sm">Social Media (Twitter/X, Instagram)</Label>
                <Input id="social_media" value={form.social_media} onChange={(e) => update("social_media", e.target.value)} placeholder="@handle or URL" />
              </div>
            </div>
          </div>

          {/* Section: Funding & Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Funding & Support</h3>
            <div className="flex items-center gap-3">
              <Switch checked={isIncubated} onCheckedChange={setIsIncubated} id="is_incubated" />
              <Label htmlFor="is_incubated" className="text-sm cursor-pointer">Part of an incubator / accelerator?</Label>
            </div>
            {isIncubated && (
              <div className="space-y-1.5">
                <Label htmlFor="incubator_name" className="text-sm">Incubator / Accelerator Name</Label>
                <Input id="incubator_name" value={form.incubator_name} onChange={(e) => update("incubator_name", e.target.value)} placeholder="e.g. Flat6Labs, KAUST" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="funding_type" className="text-sm">Funding Type</Label>
                <Select value={form.funding_type} onValueChange={(v) => update("funding_type", v)}>
                  <SelectTrigger id="funding_type"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {fundingTypes.map((ft) => (
                      <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="funding_amount" className="text-sm">Funding Amount</Label>
                <Input id="funding_amount" value={form.funding_amount} onChange={(e) => update("funding_amount", e.target.value)} placeholder="e.g. $100K, SAR 100K" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="grants_received" className="text-sm">Grants Received</Label>
                <Input id="grants_received" value={form.grants_received} onChange={(e) => update("grants_received", e.target.value)} placeholder="e.g. Monsha'at grant, SIDF" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm">Anything else you'd like to share?</Label>
            <Textarea id="message" value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Your story, vision, or what makes your startup unique..." rows={3} maxLength={1000} />
          </div>

          <Button type="submit" className="w-full gradient-bg" disabled={submitting}>
            {submitting ? "Submitting..." : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FounderApplicationForm;

import { useState, useEffect } from "react";
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
import { Rocket, Send, CheckCircle2, ChevronRight, ChevronLeft, Building2, UserCircle, LineChart, MessageSquareQuote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isIncubated, setIsIncubated] = useState(false);
  const [cofounders, setCofounders] = useState<{ name: string; age: string; education: string }[]>([]);

  const totalSteps = 4;

  const [form, setForm] = useState({
    founder_name: "",
    email: "",
    phone: "",
    country: "Saudi Arabia",
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

  useEffect(() => {
    if (open) {
      setForm(prev => ({ ...prev, feature_type: defaultFeatureType }));
    }
  }, [open, defaultFeatureType]);

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

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return !!(form.founder_name && form.email && form.country);
      case 2:
        return !!(form.company_name && form.industry && form.stage && form.one_liner);
      case 3:
        return true; // Optional fields mostly
      case 4:
        return !!form.message; // Require some narrative for the story
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Please fill in all required fields to continue.");
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!isStepValid(totalSteps)) {
      toast.error("Please ensure your story is filled out.");
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
      setCurrentStep(1);
      setForm({
        founder_name: "", email: "", phone: "", country: "Saudi Arabia", city: "",
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

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const steps = [
    { icon: UserCircle, label: "The Founder" },
    { icon: Building2, label: "The Startup" },
    { icon: LineChart, label: "The Metrics" },
    { icon: MessageSquareQuote, label: "The Story" }
  ];

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
              <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3">Application Submitted!</h3>
            <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Thank you for sharing your journey. Our editorial team will review your application and reach out if you're a fit for an upcoming feature.
            </p>
            <Button onClick={handleClose} className="mt-8 px-8 h-12 shadow-lg">
              Return Home
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header & Progress */}
          <div className="p-6 border-b border-border/50 bg-muted/20">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-display text-2xl flex items-center gap-2">
                <Rocket className="h-6 w-6 text-primary" />
                Get Featured on Founders KSA
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                We're looking for Saudi Arabia's boldest builders. Tell us your story.
              </DialogDescription>
            </DialogHeader>

            {/* Stepper */}
            <div className="flex justify-between items-center relative z-10">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-bg"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const active = currentStep === stepNum;
                const completed = currentStep > stepNum;

                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${active ? "border-primary bg-card shadow-lg shadow-primary/20" :
                        completed ? "border-primary gradient-bg text-primary-foreground" :
                          "border-muted bg-card text-muted-foreground"
                      }`}>
                      {completed ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${active ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content Area */}
          <div className="p-6 overflow-y-auto overflow-x-hidden flex-1 no-scrollbar">
            <AnimatePresence mode="wait">
              {/* --- STEP 1: THE FOUNDER --- */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="founder_name">Full Name *</Label>
                        <Input id="founder_name" value={form.founder_name} onChange={(e) => update("founder_name", e.target.value)} placeholder="e.g. Tariq Al-Faisal" autoFocus className="h-11 border-border/60" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="tariq@startup.sa" className="h-11 border-border/60" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+966 5..." className="h-11 border-border/60" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                        <Input id="linkedin_url" value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} placeholder="linkedin.com/in/..." className="h-11 border-border/60" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country of Residence *</Label>
                        <Input id="country" value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Saudi Arabia" className="h-11 border-border/60" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="e.g. Riyadh" className="h-11 border-border/60" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border/50">
                    <div className="space-y-4">
                      <Label htmlFor="num_cofounders" className="text-base font-semibold">Do you have co-founders?</Label>
                      <p className="text-sm text-muted-foreground mb-4">Select the total number of founders, including yourself.</p>
                      <Select value={form.num_cofounders} onValueChange={handleCofounderCountChange}>
                        <SelectTrigger id="num_cofounders" className="h-11 w-full sm:w-[200px]"><SelectValue placeholder="Total Founders" /></SelectTrigger>
                        <SelectContent>
                          {["1", "2", "3", "4", "5"].map((n) => (
                            <SelectItem key={n} value={n}>{n === "1" ? "Just me (1)" : `${n} Founders`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {cofounders.length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 mt-6">
                          {cofounders.map((cofounder, i) => (
                            <div key={i} className="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-4 relative">
                              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Co-founder {i + 2}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Name</Label>
                                  <Input value={cofounder.name} onChange={(e) => updateCofounder(i, "name", e.target.value)} placeholder="Full Name" className="h-10" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Age / Education</Label>
                                  <Input value={cofounder.education} onChange={(e) => updateCofounder(i, "education", e.target.value)} placeholder="e.g. 28, KAUST Alumni" className="h-10" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- STEP 2: THE STARTUP --- */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">What are you building?</Label>
                      <p className="text-sm text-muted-foreground mb-4">Let's talk about the company you're creating.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="company_name">Company Name *</Label>
                        <Input id="company_name" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} placeholder="e.g. TechSA" className="h-11" autoFocus />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company_website">Website / Product URL</Label>
                        <Input id="company_website" value={form.company_website} onChange={(e) => update("company_website", e.target.value)} placeholder="https://..." className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry *</Label>
                        <Select value={form.industry} onValueChange={(v) => update("industry", v)}>
                          <SelectTrigger id="industry" className="h-11"><SelectValue placeholder="Select industry" /></SelectTrigger>
                          <SelectContent>
                            {industries.map((ind) => (
                              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stage">Current Stage *</Label>
                        <Select value={form.stage} onValueChange={(v) => update("stage", v)}>
                          <SelectTrigger id="stage" className="h-11"><SelectValue placeholder="Select stage" /></SelectTrigger>
                          <SelectContent>
                            {stages.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label htmlFor="one_liner">Company One-liner *</Label>
                      <p className="text-xs text-muted-foreground mb-2">Describe what your company does in 50 words or less. Make it punchy.</p>
                      <Textarea
                        id="one_liner"
                        value={form.one_liner}
                        onChange={(e) => update("one_liner", e.target.value)}
                        placeholder="We are building X for Y to solve Z..."
                        rows={3}
                        className="resize-none"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- STEP 3: THE METRICS --- */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Traction & Support</Label>
                      <p className="text-sm text-muted-foreground mb-4">Numbers speak volumes. Share where you are currently at.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="team_size">Total Team Size</Label>
                        <Input id="team_size" value={form.team_size} onChange={(e) => update("team_size", e.target.value)} placeholder="e.g. 5" className="h-11" autoFocus />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="revenue">Current Revenue (Optional)</Label>
                        <Input id="revenue" value={form.revenue} onChange={(e) => update("revenue", e.target.value)} placeholder="e.g. Pre-revenue, $10K MRR" className="h-11" />
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <Label htmlFor="is_incubated" className="text-base cursor-pointer">Incubator / Accelerator</Label>
                          <p className="text-xs text-muted-foreground mt-1">Are you currently part of or graduated from a startup program?</p>
                        </div>
                        <Switch checked={isIncubated} onCheckedChange={setIsIncubated} id="is_incubated" className="data-[state=checked]:bg-primary" />
                      </div>

                      <AnimatePresence>
                        {isIncubated && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 pt-2 border-t border-border/30"
                          >
                            <Label htmlFor="incubator_name">Program Name</Label>
                            <Input id="incubator_name" value={form.incubator_name} onChange={(e) => update("incubator_name", e.target.value)} placeholder="e.g. Flat6Labs, Sanabil 500, Garage" className="h-11" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="funding_type">Funding Status</Label>
                        <Select value={form.funding_type} onValueChange={(v) => update("funding_type", v)}>
                          <SelectTrigger id="funding_type" className="h-11"><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            {fundingTypes.map((ft) => (
                              <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="funding_amount">Funding Amount</Label>
                        <Input id="funding_amount" value={form.funding_amount} onChange={(e) => update("funding_amount", e.target.value)} placeholder="e.g. $150K, SAR 500K" className="h-11" />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="grants_received">Grants Received</Label>
                        <Input id="grants_received" value={form.grants_received} onChange={(e) => update("grants_received", e.target.value)} placeholder="e.g. Monsha'at grant, SIDF, NTDP" className="h-11" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- STEP 4: THE STORY --- */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">The "Why"</Label>
                      <p className="text-sm text-muted-foreground mb-4">This is the most important part. We want to know the story behind the startup.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="feature_type">What kind of feature are you looking for?</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: "rising_founder", label: "Rising Founder", desc: "Short spotlight on you and your MVP." },
                            { value: "founder_story", label: "Deep-Dive Story", desc: "In-depth article about your journey." },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => update("feature_type", opt.value)}
                              className={`p-4 rounded-xl text-left border transition-all ${form.feature_type === opt.value
                                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                  : "border-border/60 bg-card hover:border-primary/30"
                                }`}
                            >
                              <p className={`font-medium mb-1 ${form.feature_type === opt.value ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                              <p className="text-[0.65rem] sm:text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <Label htmlFor="message">Why should we feature you? *</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          What specific problem are you solving for Saudi Arabia or the world? What was the "aha!" moment that sparked this idea? Be authentic, show your passion.
                        </p>
                        <Textarea
                          id="message"
                          value={form.message}
                          onChange={(e) => update("message", e.target.value)}
                          placeholder="I realized the current ecosystem was lacking..."
                          rows={6}
                          className="resize-none"
                          required
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="p-6 border-t border-border/50 bg-muted/10 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className={`px-6 h-11 ${currentStep === 1 ? 'invisible' : ''}`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>

            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep} className="px-8 h-11 gradient-bg border-0 text-primary-foreground shadow-lg shadow-primary/20">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="px-8 h-11 gradient-bg border-0 text-primary-foreground shadow-lg shadow-primary/20"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FounderApplicationForm;


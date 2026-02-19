import { useState } from "react";
import { usePageSEO } from "@/hooks/use-page-seo";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Quote, TrendingUp, Lightbulb, MapPin, ChevronRight, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const featuredStories = [
  {
    id: "njd-studio",
    industry: "Gaming",
    title: "From Teenage Coder to 5 Million Downloads",
    founder: "Salman",
    company: "NJD Studio",
    initials: "S",
    color: "from-rose-500 to-orange-400",
  },
  {
    id: "alain-edene",
    industry: "Healthcare",
    title: "From the Janitor's Closet to the Boardroom",
    founder: "Sir Alain Edene",
    company: "Fittin International",
    initials: "AE",
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: "treehouse",
    industry: "F&B / Hospitality",
    title: "Rooted in Resilience: Riyadh's Farm-to-Table Café",
    founder: "Lulwah Al Juraiban",
    company: "Treehouse",
    initials: "LA",
    color: "from-amber-500 to-yellow-400",
  },
  {
    id: "hassan-ikram",
    industry: "Consultancy",
    title: "The Architect of Startups in Saudi Arabia",
    founder: "Hassan Ikram",
    company: "Cotyledon",
    initials: "HI",
    color: "from-violet-500 to-indigo-400",
  },
];

const founderQuotes = [
  {
    quote: "Hard work eventually pays off — just don't give up on the drive.",
    founder: "Hassan Ikram",
    company: "Cotyledon",
  },
  {
    quote: "Success is never owned, it is rented. And rent is due every day.",
    founder: "Sir Alain Edene",
    company: "Fittin International",
  },
  {
    quote: "Build for the player, and the success will follow.",
    founder: "Salman",
    company: "NJD Studio",
  },
];

const ecosystemHighlights = [
  {
    icon: TrendingUp,
    stat: "SAR 6B+",
    label: "Gaming & Entertainment Investment",
    desc: "Saudi Arabia is the largest gaming market in MENA",
    source: "Source: Savvy Games Group / Vision 2030",
  },
  {
    icon: Lightbulb,
    stat: "2,000+",
    label: "Active Startups",
    desc: "A rapidly growing ecosystem backed by Vision 2030",
    source: "Source: Monsha'at / MISA reports",
  },
  {
    icon: MapPin,
    stat: "5 Cities",
    label: "Startup Hubs",
    desc: "Riyadh, Jeddah, Dammam, NEOM, and more",
    source: "Source: Saudi Vision 2030 framework",
  },
];

const Index = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  usePageSEO({
    description: "Discover real founder stories from Saudi Arabia's boldest entrepreneurs. Real lessons, failures, and wins — your playbook for building in the Kingdom.",
    path: "/",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubmitting(true);
    try {
      const res = await supabase.functions.invoke("send-subscription", {
        body: { email: email.trim() },
      });
      if (res.error) throw res.error;
      setSubscribed(true);
      toast.success("You're subscribed! We'll send you new founder stories.");
      setEmail("");
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-[0.04]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full gradient-bg opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]" />

        <div className="px-4 sm:container py-20 sm:py-28 md:py-40 relative">
          <div className="max-w-4xl mx-auto text-center">


            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
              The Stories Behind
              <br />
              <span className="gradient-text">Saudi Arabia's</span> Boldest Founders
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Go behind the scenes with entrepreneurs who risked it all. Real lessons, real failures, real wins — your playbook for building in the Kingdom.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16">
              <Button asChild size="lg" className="gradient-bg border-0 text-primary-foreground hover:opacity-90 text-sm sm:text-base px-8 h-12 shadow-lg shadow-primary/20">
                <Link to="/stories">Read the Stories <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-sm sm:text-base px-8 h-12">
                <Link to="/about">About the Ecosystem</Link>
              </Button>
            </div>

            {/* Mini founder avatars as social proof */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex -space-x-3">
                {featuredStories.map((s) => (
                  <div key={s.id} className={`w-9 h-9 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center text-[0.6rem] font-bold text-white ring-2 ring-background`}>
                    {s.initials}
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Real stories from <span className="font-medium text-foreground">real founders</span> across the Kingdom
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Saudi Startup Ecosystem — Industry Data */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="px-4 sm:container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 text-center">Saudi Ecosystem</p>
          <h2 className="font-display text-lg sm:text-xl font-semibold mb-8 text-center text-muted-foreground">
            Industry data powering the Kingdom's startup scene
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-10 max-w-4xl mx-auto">
            {ecosystemHighlights.map((item) => (
              <div key={item.label} className="text-center sm:text-left group">
                <div className="inline-flex items-center justify-center sm:justify-start w-10 h-10 rounded-xl gradient-bg mb-4">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold mb-1">{item.stat}</p>
                <p className="text-sm font-medium text-foreground mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-muted-foreground/60 mt-1 italic">{item.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories — Editorial Grid */}
      <section className="py-16 sm:py-24 bg-muted/30 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="px-4 sm:container relative">
          <div className="flex items-end justify-between mb-10 sm:mb-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Featured</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
                Latest Stories
              </h2>
            </div>
            <Link to="/stories" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Bento-style grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {featuredStories.map((story, i) => (
              <Link
                key={story.id}
                to={`/stories/${story.id}`}
                className={`group block ${i === 0 ? "sm:col-span-2" : ""}`}
              >
                <div className={`relative rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 bg-card overflow-hidden ${i === 0 ? "p-8 sm:p-12" : "p-6 sm:p-8"}`}>
                  {/* Subtle gradient accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${story.color} opacity-[0.08] blur-[60px] group-hover:opacity-[0.15] transition-opacity`} />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                        {story.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{story.founder}</p>
                        <p className="text-xs text-muted-foreground">{story.company}</p>
                      </div>
                      <span className="ml-auto px-2.5 py-0.5 rounded-full text-[0.6rem] sm:text-xs font-medium gradient-bg text-primary-foreground">
                        {story.industry}
                      </span>
                    </div>

                    <h3 className={`font-display font-bold group-hover:text-primary transition-colors leading-tight ${i === 0 ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl"}`}>
                      {story.title}
                    </h3>

                    <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Read story <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/stories" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              View all stories →
            </Link>
          </div>
        </div>
      </section>

      {/* Founder Quotes */}
      <section className="py-16 sm:py-24">
        <div className="px-4 sm:container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 text-center">In Their Words</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-10 sm:mb-14 text-center">
            Wisdom from the <span className="gradient-text">Founders</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {founderQuotes.map((q, i) => (
              <div key={i} className="relative rounded-2xl border border-border/50 p-6 sm:p-8 bg-card group hover:border-primary/20 transition-all">
                <Quote className="h-8 w-8 text-primary/15 mb-4" />
                <blockquote className="text-sm sm:text-base leading-relaxed text-foreground mb-6 font-medium italic">
                  "{q.quote}"
                </blockquote>
                <div className="border-t border-border/50 pt-4">
                  <p className="text-sm font-semibold text-foreground">{q.founder}</p>
                  <p className="text-xs text-muted-foreground">{q.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="px-4 sm:container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl gradient-bg mb-5">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Never Miss a <span className="gradient-text">Story</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Get new founder stories, ecosystem insights, and startup resources delivered to your inbox. No spam, just inspiration.
            </p>

            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-primary font-medium">
                <CheckCircle2 className="h-5 w-5" />
                <span>You're on the list! Stay tuned for new stories.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-border/60 bg-card shadow-sm flex-1"
                />
                <Button type="submit" disabled={submitting} className="gradient-bg border-0 text-primary-foreground hover:opacity-90 h-12 px-6 rounded-xl shadow-lg shadow-primary/20">
                  {submitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}

            <p className="text-[0.65rem] sm:text-xs text-muted-foreground mt-4">
              Join 100+ founders and investors already subscribed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="px-4 sm:container">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-bg" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />

            <div className="relative p-10 sm:p-16 md:p-24 text-center">
              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
                Your Story Could Be Next
              </h2>
              <p className="text-primary-foreground/80 text-sm sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                We're documenting the next generation of founders building in Saudi Arabia. Want to be featured?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" variant="outline" className="bg-white text-foreground hover:bg-white/90 border-0 text-sm sm:text-base px-8 h-12 shadow-xl">
                  <Link to="/stories">Explore Stories <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-white/10 text-sm sm:text-base px-8 h-12">
                  <Link to="/about">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

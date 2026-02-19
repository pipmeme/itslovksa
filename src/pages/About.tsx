import Layout from "@/components/Layout";
import { usePageSEO } from "@/hooks/use-page-seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";

const values = [
{
  icon: Target,
  title: "Mission",
  description:
  "To empower aspiring entrepreneurs with the knowledge, resources, and inspiration they need to build successful businesses in Saudi Arabia."
},
{
  icon: Eye,
  title: "Vision",
  description:
  "A thriving Saudi entrepreneurial ecosystem where every founder has access to clear guidance and a supportive community."
},
{
  icon: Heart,
  title: "Values",
  description:
  "Transparency, accessibility, and authenticity. We believe real stories and practical guides make the difference."
}];


const About = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  usePageSEO({
    title: "About Founders KSA",
    description: "Learn about Founders KSA — our mission to make entrepreneurship in Saudi Arabia accessible, transparent, and inspiring for everyone.",
    path: "/about"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await supabase.functions.invoke("send-subscription", {
        body: { ...formData, type: "contact" }
      });
      if (res.error) throw res.error;
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon."
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden py-10 sm:py-16 md:py-24">
        <div className="absolute inset-0 gradient-bg opacity-[0.03]" />
        <div className="px-4 sm:container relative">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center">

            <motion.h1 variants={fadeUp} custom={0} className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              About <span className="gradient-text">Founders KSA</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make entrepreneurship in Saudi Arabia accessible, transparent, and inspiring for everyone.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 sm:py-16 bg-muted/30">
        <div className="px-4 sm:container">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {values.map((value, i) =>
            <motion.div
              key={value.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}>

                <Card className="h-full border-border/50 text-center">
                  <CardContent className="p-5 sm:p-8">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 mx-auto rounded-xl gradient-bg flex items-center justify-center mb-4 sm:mb-5">
                      <value.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{value.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="px-4 sm:container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto">

            <motion.h2 variants={fadeUp} custom={0} className="font-display text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
              Our <span className="gradient-text">Story</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={1} className="text-sm sm:text-base md:text-lg text-muted-foreground space-y-4 leading-relaxed">
              <p>
                Founders KSA was born from a simple frustration: finding clear, reliable information about starting a business in Saudi Arabia was unnecessarily difficult. Government portals, scattered blog posts, and word-of-mouth advice left aspiring entrepreneurs confused and overwhelmed.
              </p>
              <p>
                We set out to change that. By compiling comprehensive licensing guides, documenting the startup ecosystem, and sharing authentic founder stories, we created a single destination for anyone looking to build in the Kingdom.
              </p>
              <p>Whether you're a Saudi national exploring your first freelancer license, an international founder considering the KSA market, or simply curious about the vibrant startup scene — Founders KSA is here to guide you every step of the way. This website is a personal informational project and does not currently operate as a commercial business.

              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-10 sm:py-16 md:py-20 bg-muted/30">
        <div className="px-4 sm:container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12">

              <motion.h2 variants={fadeUp} custom={0} className="font-display text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                Get in <span className="gradient-text">Touch</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-sm sm:text-lg">
                Have a question, want to share your story, or just say hello? We'd love to hear from you.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-6 sm:gap-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="md:col-span-2 space-y-4 sm:space-y-6">

                <motion.div variants={fadeUp} custom={0} className="flex gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">Email</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">info@foundersksa.com</p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} custom={1} className="flex gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">Location</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="md:col-span-3">

                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        <Input
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="text-sm sm:text-base" />

                        <Input
                          type="email"
                          placeholder="Your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="text-sm sm:text-base" />

                      </div>
                      <Textarea
                        placeholder="Your message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="text-sm sm:text-base" />

                      <Button type="submit" disabled={submitting} className="gradient-bg border-0 text-primary-foreground hover:opacity-90 text-sm sm:text-base w-full sm:w-auto">
                        {submitting ? "Sending..." : "Send Message"} {!submitting && <Send className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>);

};

export default About;
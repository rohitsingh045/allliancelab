import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Clock, Shield, MapPin, Phone } from "lucide-react";
import { createBooking } from "@/api/client.js";
import { useLang } from "@/context/LanguageContext";

const HomeCollection = () => {
  const { t } = useLang();

  const steps = [
    { step: "1", title: t.bookOnline, desc: t.bookOnlineDesc },
    { step: "2", title: t.weVisitYou, desc: t.weVisitYouDesc },
    { step: "3", title: t.sampleCollected, desc: t.sampleCollectedDesc },
    { step: "4", title: t.getReports, desc: t.getReportsDesc },
  ];

  const benefits = [
    { icon: Home, title: t.doorstepService, desc: t.doorstepServiceDesc },
    { icon: Clock, title: t.flexibleTiming, desc: t.flexibleTimingDesc },
    { icon: Shield, title: t.certifiedLabs, desc: t.certifiedLabsDesc },
    { icon: MapPin, title: t.wideCoverage, desc: t.wideCoverageDesc },
  ];
  const [formData, setFormData] = useState({ name: "", phone: "", city: "Mumbai" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    setLoading(true);
    try {
      await createBooking(formData);
      setSubmitted(true);
      setFormData({ name: "", phone: "", city: "Mumbai" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <Home className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground">{t.freeHomeCollectionBadge}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            {t.getTestsDoneAtHome}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg mb-8">
            {t.homeCollectionSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/90 text-sm">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t.freeService}</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t.slotsTime}</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t.fiftyPlusCities}</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-center text-foreground mb-12">
            {t.howItWorks}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="text-center bg-card rounded-2xl border border-border p-6 shadow-card">
                <div className="w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground font-heading font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-center text-foreground mb-12">
            {t.whyChooseHomeCollection}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-md">
          <h2 className="text-2xl font-heading font-extrabold text-center text-foreground mb-8">
            {t.bookFreeHomeCollection}
          </h2>
          {submitted ? (
            <div className="text-center bg-accent/10 rounded-2xl p-8 border border-accent/30">
              <CheckCircle className="w-12 h-12 text-accent mx-auto mb-3" />
              <p className="font-heading font-bold text-lg text-foreground">{t.bookingReceived}</p>
              <p className="text-sm text-muted-foreground mt-1">{t.callYouShortly}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
              <input
                type="text"
                placeholder={t.fullName}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                required
                maxLength={100}
              />
              <input
                type="tel"
                placeholder={t.contactNumber}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                required
                pattern="[0-9]{10}"
                title="Enter 10 digit mobile number"
              />
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
              >
                {["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Nagpur"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold py-6 rounded-xl text-base"
              >
                {loading ? t.submitting : t.bookNowFree}
              </Button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeCollection;

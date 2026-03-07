import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Clock, Shield, MapPin, Phone } from "lucide-react";
import { createBooking } from "@/api/client.js";

const steps = [
  { step: "1", title: "Book Online", desc: "Choose your tests and select home collection at checkout." },
  { step: "2", title: "We Visit You", desc: "Our certified phlebotomist arrives at your doorstep at your preferred time." },
  { step: "3", title: "Sample Collected", desc: "Samples are collected safely and transported in temperature-controlled kits." },
  { step: "4", title: "Get Reports", desc: "Receive accurate digital reports within 6–24 hours on your dashboard." },
];

const benefits = [
  { icon: Home, title: "Doorstep Service", desc: "No need to travel — we come to your home, office, or any preferred location." },
  { icon: Clock, title: "Flexible Timing", desc: "Book slots from 6 AM to 9 PM, including weekends and holidays." },
  { icon: Shield, title: "Certified Labs", desc: "All samples processed in certified labs with 99.9% accuracy." },
  { icon: MapPin, title: "Wide Coverage", desc: "Available across 50+ cities with 900+ trained phlebotomists." },
];

const HomeCollection = () => {
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
            <span className="text-sm font-semibold text-primary-foreground">Free Home Collection</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            Get Your Tests Done at Home
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg mb-8">
            No queues, no travel. Our trained phlebotomists visit your doorstep with proper safety gear and collect samples in just 5 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/90 text-sm">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Free Service</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> 6AM – 9PM Slots</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> 50+ Cities</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-center text-foreground mb-12">
            How It Works
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
            Why Choose Home Collection?
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
            Book Free Home Collection
          </h2>
          {submitted ? (
            <div className="text-center bg-accent/10 rounded-2xl p-8 border border-accent/30">
              <CheckCircle className="w-12 h-12 text-accent mx-auto mb-3" />
              <p className="font-heading font-bold text-lg text-foreground">Booking Received!</p>
              <p className="text-sm text-muted-foreground mt-1">We'll call you shortly to confirm.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                required
                maxLength={100}
              />
              <input
                type="tel"
                placeholder="Contact Number"
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
                {loading ? "Submitting..." : "Book Now — It's Free"}
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { createBooking } from "@/api/client.js";
import heroBanner from "@/assets/hero-family.jpg";

const HeroSection = () => {
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
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Booking failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[600px] md:min-h-[calc(100vh-140px)] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Family healthcare at Alliance Diagnostic"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-10 md:py-16 w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left content */}
          <div className="space-y-5 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-gentle" />
              <span className="text-sm font-semibold text-accent">NABL Accredited Lab</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold leading-tight text-primary-foreground">
              Stay ahead of health problems with{" "}
              <span className="text-accent">regular health check-ups</span>
            </h2>

            <div className="bg-primary/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-primary/30 inline-block">
              <p className="text-primary-foreground font-heading font-bold text-lg">
                Health Packages Starting from{" "}
                <span className="text-accent text-2xl">₹349</span>
              </p>
            </div>

            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base px-8 py-6 rounded-xl shadow-elevated"
            >
              Explore Packages
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Booking form */}
          <div className="flex justify-end">
            <div className="bg-card/95 backdrop-blur-md rounded-2xl p-6 shadow-elevated w-full max-w-sm border border-border">
              <h3 className="font-heading font-bold text-xl text-foreground mb-1">
                Book Free Home Collection
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Our phlebotomist will visit your home
              </p>

              {submitted ? (
                <div className="flex flex-col items-center py-8 text-center gap-3">
                  <CheckCircle className="w-12 h-12 text-accent" />
                  <p className="font-heading font-bold text-lg text-foreground">Booking Received!</p>
                  <p className="text-sm text-muted-foreground">We'll call you shortly to confirm.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                    required
                    maxLength={100}
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                    required
                    pattern="[0-9]{10}"
                    title="Enter 10 digit mobile number"
                  />
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground"
                  >
                    {["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold py-6 rounded-xl text-base"
                  >
                    {loading ? "Submitting..." : "Book Free Home Collection"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

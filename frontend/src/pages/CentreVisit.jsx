import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Clock, Phone, Navigation, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const centres = [
  { name: "Alliance Diagnostic — Dharampeth", address: "42 Healthcare Avenue, Dharampeth, Nagpur 440010", hours: "7:00 AM – 9:00 PM", phone: "0712-123-4567" },
  { name: "Alliance Diagnostic — Sadar", address: "15 Civil Lines Road, Sadar, Nagpur 440001", hours: "7:00 AM – 8:00 PM", phone: "0712-234-5678" },
  { name: "Alliance Diagnostic — Sitabuldi", address: "88 Main Road, Sitabuldi, Nagpur 440012", hours: "6:30 AM – 9:00 PM", phone: "0712-345-6789" },
  { name: "Alliance Diagnostic — Manewada", address: "22 Ring Road, Manewada, Nagpur 440027", hours: "7:00 AM – 8:30 PM", phone: "0712-456-7890" },
  { name: "Alliance Diagnostic — Wardha Road", address: "66 Wardha Road, Nagpur 440025", hours: "7:00 AM – 9:00 PM", phone: "0712-567-8901" },
  { name: "Alliance Diagnostic — Koradi Road", address: "10 Koradi Road, Nagpur 440030", hours: "8:00 AM – 7:00 PM", phone: "0712-678-9012" },
];

const CentreVisit = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-primary py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground">Walk-in Centres</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            Visit Our Diagnostic Centres
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Walk in at any of our diagnostic centres near you. No appointment needed for most tests.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              "No Appointment Needed",
              "Certified Labs",
              "Reports in 6–24 Hours",
              "Affordable Pricing",
            ].map((f) => (
              <span key={f} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle className="w-4 h-4 text-accent" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Centres List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-center text-foreground mb-12">
            Our Centres
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {centres.map((centre) => (
              <div key={centre.name} className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <h3 className="font-heading font-bold text-foreground text-lg mb-4">{centre.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{centre.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{centre.hours}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{centre.phone}</span>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <Button size="sm" className="bg-gradient-primary text-primary-foreground font-semibold rounded-lg">
                    <Navigation className="w-3.5 h-3.5 mr-1.5" />
                    Get Directions
                  </Button>
                  <Button size="sm" variant="outline" className="border-primary text-primary font-semibold rounded-lg">
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CentreVisit;

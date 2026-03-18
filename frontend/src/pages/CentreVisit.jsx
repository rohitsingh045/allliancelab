import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Navigation, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LanguageContext";
import { centreLocations } from "@/lib/centreLocations";

const CentreVisit = () => {
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-primary py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground">{t.walkInCentres}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            {t.visitDiagnosticCentres}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            {t.centreVisitSubtitle}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              t.noAppointmentNeeded,
              t.certifiedLabs,
              t.reportsIn624Hours,
              t.affordablePricing,
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
            {t.ourCentres}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {centreLocations.map((centre) => (
              <div key={centre.name} className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <h3 className="font-heading font-bold text-foreground text-lg mb-4">{centre.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{centre.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{centre.phone}</span>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <Button
                    size="sm"
                    className="bg-gradient-primary text-primary-foreground font-semibold rounded-lg"
                    asChild
                  >
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centre.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="w-3.5 h-3.5 mr-1.5" />
                      {t.getDirections}
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary font-semibold rounded-lg"
                    asChild
                  >
                    <a href={`tel:${centre.phone.split(",")[0].trim()}`}>
                      <Phone className="w-3.5 h-3.5 mr-1.5" />
                      {t.call}
                    </a>
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

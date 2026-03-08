import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Navigation, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const centres = [
  {
    name: "Alliance Diagnostic — Gorakhpur",
    address: "Near Saryu Nehar Colony, Opp. Hero Bike Showroom, Deoria Road, Singhariya, Gorakhpur-273008",
    phone: "91187-03479, 70805-63479",
  },
  {
    name: "Alliance Diagnostic — Patna",
    address: "Vedam Netralaya, O-42 Doctor's Colony Kankarbagh, Patna (800020)",
    phone: "6200488170",
  },
  {
    name: "Alliance Diagnostic — Ranchi",
    address: "Lig R-32, Harmu Housing Colony, Near Patel Chowk, Ranchi-834002",
    phone: "9934443513",
  },
  {
    name: "Alliance Diagnostic — Lucknow",
    address: "Shop No 222, 2nd Floor, Prince Complex, Hazratganj, Lucknow",
    phone: "+91 6392772944, +91 7080563479",
  },
  {
    name: "Alliance Diagnostic — Ahmedabad",
    address: "Cabin No. 102, 1st Floor, Emreld Building, Above Karnavati, Pagarkha, Near Choice Restaurant, Mithakhali, Navrangpura, Ahmedabad, Gujarat-380009",
    phone: "9725225607",
  },
  {
    name: "Alliance Diagnostic — Siwan",
    address: "Mahadeva Road, Siwan, Near Shiv Mandir (841226)",
    phone: "8235389036",
  },
  {
    name: "Alliance Diagnostic — Jaipur",
    address: "Mahesh Chamber, Opp. Metro Piller No. 176, W-8, Park Street, Near Bank of Baroda, M. I. Road, Jaipur (Raj.)-302001",
    phone: "8824627213, 8094970219",
  },
  {
    name: "Alliance Diagnostic — Amritsar",
    address: "SCO-72, 4th Floor, City Centre, Opp. Pingalwara, Near Bus Stand, G. T. Road, Amritsar",
    phone: "8544919364",
  },
  {
    name: "Alliance Diagnostic — Kolkata",
    address: "Airport Gate No. 1, Italgacha Road, Kolkata-700028",
    phone: "91477-33317",
  },
  {
    name: "Alliance Diagnostic — Hyderabad",
    address: "7-1-58, Surekha Chambers, Ameerpet Road, Opp. Metro Piller No. C-1434, Near Kerala Coirmat Mart, Ameerpet, Hyderabad-500016, Telangana",
    phone: "8341026607, 8341026608",
  },
  {
    name: "Alliance Diagnostic — Vadodara",
    address: "M-2 Antariksh Complex, Opp. World Trade Centre, Kadak Bazar Road, Vadodara",
    phone: "9054722437, 9054822437",
  },
  {
    name: "Alliance Diagnostic — Chandigarh",
    address: "SCO. 23, Top Floor, Sector - 33 D, Chandigarh",
    phone: "9115511309, 9115513031",
  },
  {
    name: "Alliance Diagnostic — New Delhi",
    address: "D-9, Shop No.-1, Dal Mill Road, Manjeet Farm Uttam Nagar West, Pillar No. 683, New Delhi-110059",
    phone: "83930-29412",
  },
  {
    name: "Alliance Diagnostic — Mumbai",
    address: "Shop No. 04/A Building No. 85, Kanj Kany HSC, Opposite Ambedkar Garden, Near Swamisamarth Temple, Nehru Nagar, Kurla (E), Mumbai-400024",
    phone: "9152668852, 8094970219",
  },
  {
    name: "Alliance Diagnostic — Mysuru",
    address: "Pulkeshi Road, Tilak Nagar, Mysuru-570015",
    phone: "9880924042, 9611039134",
  },
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
                      Get Directions
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
                      Call
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

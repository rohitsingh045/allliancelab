import { useState } from "react";
import { X, Search, MapPin } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const topCities = [
  "Bangalore", "Bhopal", "Bhubaneshwar", "Chennai", "Guwahati", "Hyderabad",
  "Indore", "Kolkata", "Mumbai", "Nagpur", "Pune",
];

const allCities = [
  "Ahmednagar", "Andheri", "Bankura", "Basti", "Berhampore", "Borivali",
  "Burdwan", "Coimbatore", "Dhanbad", "Dibrugarh", "Giridih", "Goa",
  "Jabalpur", "Jalgaon", "Jalna", "Kalyan", "Kolhapur", "Latur",
  "Lucknow", "Muzaffarpur", "Nashik", "Navi Mumbai", "Panvel", "Patna",
  "Prayagraj", "Raipur", "Ranchi", "Satara", "Silchar", "Siliguri",
  "Solapur", "Varanasi", "Vijayawada",
];

const CitySelector = ({ open, onClose, selectedCity, onSelectCity }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLang();

  if (!open) return null;

  const filteredCities = allCities.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (city) => {
    onSelectCity(city);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 pt-10 md:pt-20">
      <div className="bg-card rounded-xl shadow-elevated w-full max-w-3xl mx-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-xl font-heading font-bold text-primary">{t.selectYourCity}</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Top Searched Cities */}
          <div>
            <h3 className="text-base font-heading font-bold text-foreground mb-3">{t.topSearchedCities}</h3>
            <div className="flex flex-wrap gap-2">
              {topCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleSelect(city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    selectedCity === city
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Search Your City */}
          <div>
            <h3 className="text-base font-heading font-bold text-foreground mb-3">{t.searchYourCity}</h3>
            <div className="flex flex-wrap gap-2">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleSelect(city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    selectedCity === city
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div>
            <h3 className="text-base font-heading font-bold text-foreground mb-3">{t.searchForMoreCities}</h3>
            <div className="relative">
              <input
                type="text"
                placeholder={t.startTypingCity}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelector;

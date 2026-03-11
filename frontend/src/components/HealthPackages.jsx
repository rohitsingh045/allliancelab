import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, FlaskConical, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchHealthPackages } from "@/api/client.js";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { toast } from "sonner";

const HealthPackages = () => {
  const scrollRef = useRef(null);
  const { addItem, isInCart } = useCart();
  const { t } = useLang();

  const { data: packages = [] } = useQuery({
    queryKey: ["healthPackages"],
    queryFn: fetchHealthPackages,
  });

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleAddToCart = (pkg) => {
    if (isInCart(pkg._id, "package")) {
      toast.info(`${pkg.name} ${t.alreadyInCart}`);
      return;
    }
    addItem({
      id: pkg._id,
      type: "package",
      name: pkg.name,
      price: pkg.price,
      parameters: pkg.parameters,
      reportTime: pkg.reportTime,
    });
    toast.success(`${pkg.name} ${t.addedToCart}`, {
      description: t.goToCart,
    });
  };

  if (packages.length === 0) return null;

  return (
    <section id="health-packages" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground">
            {t.popularHealthCheckupPackages}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 font-semibold rounded-lg px-5"
            >
              {t.comparePackagesBtn}
            </Button>
            <Button
              variant="outline"
              className="border-accent text-accent hover:bg-accent/5 font-semibold rounded-lg px-5"
            >
              {t.createYourPackages}
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 font-semibold rounded-lg px-5"
            >
              {t.viewAllPackages}
            </Button>
          </div>
        </div>

        {/* Cards carousel */}
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
          >
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="min-w-[300px] max-w-[320px] flex-shrink-0 snap-start bg-card rounded-2xl border border-border/80 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col"
              >
                {/* Purple header */}
                <div className="bg-gradient-primary rounded-t-2xl p-5 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-heading font-bold text-primary-foreground text-sm leading-snug flex-1">
                      {pkg.name}
                    </h3>
                    <span className="text-xl font-heading font-extrabold text-primary-foreground whitespace-nowrap">
                      ₹ {pkg.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-primary-foreground/80 text-sm">
                    {pkg.parameters} {t.testParameters}
                  </p>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </span>
                      <span className="text-sm text-foreground">
                        {t.reportOn} {pkg.reportTime.toLowerCase() === "same day" ? "same day" : pkg.reportTime.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <FlaskConical className="w-4 h-4 text-primary" />
                      </span>
                      <span className="text-sm text-foreground">{pkg.prerequisites}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border pt-4 mt-6 flex items-center justify-between gap-2">
                    <button className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
                      {t.knowMore}
                    </button>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                        <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                        {t.compare}
                      </label>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(pkg)}
                        className={`font-semibold rounded-lg px-4 whitespace-nowrap ${
                          isInCart(pkg._id, "package")
                            ? "bg-green-600 hover:bg-green-600 text-white"
                            : "bg-accent hover:bg-accent/90 text-accent-foreground"
                        }`}
                      >
                        {isInCart(pkg._id, "package") ? t.addedCheck : t.addToCart}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthPackages;

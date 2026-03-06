import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Clock, FileText, ShoppingCart, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTests, fetchCategories, fetchSampleReports } from "@/api/client.js";
import SampleReportModal from "@/components/SampleReportModal.jsx";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const TestsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedReportTestId, setSelectedReportTestId] = useState(null);
  const { addItem, isInCart } = useCart();

  const { data: tests = [] } = useQuery({
    queryKey: ["tests"],
    queryFn: () => fetchTests(),
  });

  const { data: categories = ["All"] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: sampleReports = [] } = useQuery({
    queryKey: ["sampleReports"],
    queryFn: fetchSampleReports,
  });

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || test.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tests, searchQuery, activeCategory]);

  const handleAddToCart = (test) => {
    if (isInCart(test._id, "test")) {
      toast.info(`${test.name} is already in cart`);
      return;
    }
    addItem({
      id: test._id,
      type: "test",
      name: test.name,
      price: test.price,
      parameters: test.parameters,
      reportTime: test.reportTime,
    });
    toast.success(`${test.name} added to cart!`, {
      description: "Go to cart to proceed with booking.",
    });
  };

  const selectedReport = sampleReports.find((r) => r.test?._id === selectedReportTestId || r.test === selectedReportTestId) || null;

  return (
    <section id="tests-section" className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header – centered */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold mb-4">
            <Beaker className="w-4 h-4" />
            Frequently Booked
          </div>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-3">
            Popular Diagnostic Tests
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            NABL accredited lab with 99.9% accuracy. Get reports in just 6-24 hours.
          </p>
        </div>

        {/* Search – centered */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Category Filters – centered */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-gradient-primary text-primary-foreground shadow-card"
                  : "bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tests Grid */}
        {/* Tests Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTests.map((test) => (
            <div
              key={test._id}
              className="bg-card rounded-2xl border border-border/80 shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Top content */}
              <div className="p-5 pb-0 flex-1 flex flex-col">
                {/* Category + Report Time row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-primary border border-primary/30 bg-primary/5 px-3 py-1 rounded-full">
                    {test.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {test.reportTime}
                  </span>
                </div>

                {/* Test Name */}
                <h3 className="font-heading font-bold text-foreground text-base md:text-lg mb-4 leading-snug">
                  {test.name}
                </h3>

                {/* Parameters */}
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Parameters</span>
                  <span className="font-semibold text-foreground">{test.parameters}</span>
                </div>

                {/* Pre-requisites */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Pre-requisites</span>
                  <span className="font-medium text-foreground text-right text-xs max-w-[55%]">
                    {test.prerequisites}
                  </span>
                </div>
              </div>

              {/* Divider + Footer */}
              <div className="border-t border-border mx-5" />
              <div className="px-5 py-4 flex items-center justify-between">
                <span className="text-2xl font-heading font-extrabold text-foreground">
                  ₹{test.price}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedReportTestId(test._id)}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Sample
                  </button>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(test)}
                    className={`font-semibold rounded-lg px-4 ${
                      isInCart(test._id, "test")
                        ? "bg-green-600 hover:bg-green-600 text-white"
                        : "bg-gradient-primary hover:opacity-90 text-primary-foreground"
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                    {isInCart(test._id, "test") ? "Added" : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No tests found matching your search.</p>
          </div>
        )}

        <SampleReportModal
          report={selectedReport}
          onClose={() => setSelectedReportTestId(null)}
        />
      </div>
    </section>
  );
};

export default TestsSection;

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Search, Clock, FileText, ShoppingCart, Beaker, CheckCircle2, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTests, fetchCategories, fetchSampleReports } from "@/api/client.js";
import SampleReportModal from "@/components/SampleReportModal.jsx";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { toast } from "sonner";

const TestsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedReportTestId, setSelectedReportTestId] = useState(null);
  const { addItem, decrementItem, isInCart, getQuantity } = useCart();
  const { t } = useLang();
  const { user } = useAuth();

  // For editing
  const [editingTestId, setEditingTestId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "" });
  // Handle edit button click
  const handleEditClick = (test) => {
    setEditingTestId(test._id);
    setEditForm({ name: test.name, price: test.price });
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save edit
  const handleEditSave = async (testId) => {
    try {
      // Call backend API to update test (adjust endpoint as needed)
      const res = await fetch(`/api/tests/${testId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update test");
      toast.success("Test updated successfully");
      setEditingTestId(null);
      // Optionally: refetch tests or update state locally
      window.location.reload(); // quick way to refresh
    } catch (err) {
      toast.error("Error updating test");
    }
  };

  // Handle cancel edit
  const handleEditCancel = () => {
    setEditingTestId(null);
  };

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
    addItem({
      id: test._id,
      type: "test",
      name: test.name,
      price: test.price,
      parameters: test.parameters,
      reportTime: test.reportTime,
    });
    toast.success(`${test.name} ${t.addedToCart}`, {
      description: t.goToCart,
    });
  };

  const handleDecrement = (test) => {
    decrementItem(test._id, "test");
    toast.info(`${test.name} ${t.removedFromCart}`);
  };

  const selectedReport = sampleReports.find((r) => r.test?._id === selectedReportTestId || r.test === selectedReportTestId) || null;

  return (
    <section id="tests-section" className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header – centered */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold mb-4">
            <Beaker className="w-4 h-4" />
            {t.frequentlyBooked}
          </div>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-3">
            {t.popularDiagnosticTests}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t.testsSubtitle}
          </p>
        </div>

        {/* Search – centered */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.searchTests}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test._id}
              className="group bg-card rounded-3xl border border-border/60 hover:border-primary/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden w-full max-w-sm mx-auto relative"
            >
              {/* Subtle top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>

              {/* Top content */}
              <div className="p-5 px-6 pb-4 flex-1 flex flex-col z-10 relative">
                {/* Category + Report Time row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-primary border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-md">
                    {test.category}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 bg-secondary/80 px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-primary/80" />
                    {test.reportTime}
                  </span>
                </div>

                {/* Test Name (editable for admin) */}
                {user?.role === "admin" && editingTestId === test._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="mb-4 px-3 py-2 border border-border/80 bg-secondary/30 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-base font-semibold"
                  />
                ) : (
                  <h3 className="font-heading font-extrabold text-foreground text-[1.1rem] leading-snug mb-5 decoration-primary/30 decoration-2 group-hover:underline overflow-hidden text-ellipsis line-clamp-2 min-h-[2.8rem]">
                    {test.name}
                  </h3>
                )}

                {/* Details box - More stylish parameter/prerequisite area */}
                <div className="mt-auto space-y-3 bg-gradient-to-b from-secondary/40 to-secondary/10 rounded-2xl p-4 border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted-foreground flex items-center gap-2 font-medium">
                      <Activity className="w-4 h-4 text-primary/70" />
                      {t.parameters || "Parameters"}
                    </span>
                    <span className="font-bold text-foreground text-sm bg-background px-2.5 py-0.5 rounded shadow-sm border border-border/50">
                      {test.parameters}
                    </span>
                  </div>
                  
                  <div className="h-px w-full bg-border/50 rounded-full" />
                  
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[13px] text-muted-foreground flex items-center gap-2 font-medium whitespace-nowrap">
                      <Shield className="w-4 h-4 text-primary/70 shrink-0" />
                      {t.prerequisites || "Pre-requisites"}
                    </span>
                    <span className="font-semibold text-foreground text-right text-[12px] leading-tight flex-1">
                      {test.prerequisites || "No fasting required"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Footer section */}
              <div className="bg-secondary/20 p-5 px-6 border-t border-border/40 flex items-center justify-between">
                <div className="flex flex-col">
                  {user?.role === "admin" && editingTestId === test._id ? (
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="px-2 py-1 border border-border/80 bg-background rounded-lg w-24 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-heading font-extrabold text-foreground">₹{test.price}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setSelectedReportTestId(test._id)}
                    className="p-2 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors shrink-0"
                    title={t.sample || "Sample Report"}
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  {user?.role === "admin" ? (
                    editingTestId === test._id ? (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm px-3" onClick={() => handleEditSave(test._id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl px-3 border-border/80" onClick={handleEditCancel}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-4" onClick={() => handleEditClick(test)}>
                        Edit
                      </Button>
                    )
                  ) : (
                    isInCart(test._id, "test") ? (
                      <div className="flex items-center gap-1.5 bg-background border border-primary/20 rounded-xl p-1 shadow-sm">
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                          onClick={() => handleDecrement(test)}
                        >
                          <span className="font-bold leading-none select-none text-lg mt-[-2px]">-</span>
                        </button>
                        <span className="font-bold text-sm w-5 text-center">{getQuantity(test._id, "test")}</span>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                          onClick={() => handleAddToCart(test)}
                        >
                          <span className="font-bold leading-none select-none text-lg mt-[-2px]">+</span>
                        </button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(test)}
                        className="font-bold rounded-xl px-5 transition-transform active:scale-95 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1.5" />
                        {t.add}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t.noTestsFound}</p>
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

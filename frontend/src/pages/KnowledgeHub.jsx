import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Calendar, Clock, Search, ChevronRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const articles = [
  {
    id: 1,
    title: "Understanding Your Blood Test Results: A Complete Guide",
    excerpt: "Learn what CBC, lipid profile, and other common blood tests mean and how to interpret your report values.",
    category: "Test Education",
    date: "Feb 15, 2026",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "Why Regular Health Check-ups Matter After 30",
    excerpt: "Preventive healthcare can catch diseases early. Know which tests you should get annually based on your age.",
    category: "Preventive Care",
    date: "Feb 10, 2026",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "Thyroid Disorders: Symptoms, Tests & Management",
    excerpt: "Thyroid problems are common but often go undiagnosed. Learn about T3, T4, TSH tests and what your levels mean.",
    category: "Health Conditions",
    date: "Feb 5, 2026",
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "Diabetes: HbA1c vs Fasting Blood Sugar — Which Test Do You Need?",
    excerpt: "Both tests measure blood sugar but in different ways. Understand when to use each and what the numbers mean.",
    category: "Test Education",
    date: "Jan 28, 2026",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "Vitamin D Deficiency: The Silent Epidemic in India",
    excerpt: "Despite being a tropical country, India has alarming rates of Vitamin D deficiency. Learn the symptoms and how to test.",
    category: "Health Conditions",
    date: "Jan 20, 2026",
    readTime: "5 min read",
  },
  {
    id: 6,
    title: "How to Prepare for Common Lab Tests: Fasting & Other Guidelines",
    excerpt: "Should you fast before a blood test? How much water can you drink? Get clear answers for all common tests.",
    category: "Test Preparation",
    date: "Jan 15, 2026",
    readTime: "4 min read",
  },
  {
    id: 7,
    title: "Heart Health: Understanding Lipid Profile & Cardiac Markers",
    excerpt: "Cholesterol, triglycerides, HDL, LDL — learn what each cardiac marker means and healthy ranges to target.",
    category: "Heart Health",
    date: "Jan 10, 2026",
    readTime: "9 min read",
  },
  {
    id: 8,
    title: "Complete Guide to Pregnancy Tests & Prenatal Screening",
    excerpt: "From confirmation tests to trimester-specific screenings, understand every test recommended during pregnancy.",
    category: "Women's Health",
    date: "Jan 5, 2026",
    readTime: "12 min read",
  },
];

const categories = ["All", ...new Set(articles.map((a) => a.category))];

const KnowledgeHub = () => {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = articles.filter((a) => {
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-primary py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground">{t.knowledgeHubTitle}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            {t.knowledgeHubTitle}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            {t.knowledgeHubSubtitle}
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Search */}
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.searchArticles}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Category filters */}
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

          {/* Articles grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <article
                key={article.id}
                className="bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-primary border border-primary/30 bg-primary/5 px-3 py-1 rounded-full self-start mb-3">
                    {article.category}
                  </span>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                    </div>
                    <span className="flex items-center gap-1 text-primary font-semibold hover:underline cursor-pointer">
                      Read <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">{t.noTestsFound}</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KnowledgeHub;

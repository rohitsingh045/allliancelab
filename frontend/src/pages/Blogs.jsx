import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, Search, ChevronRight, User } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Your Blood Test Results: A Complete Guide",
    excerpt: "Blood tests are one of the most common diagnostic tools. Learn how to read your CBC, lipid profile, liver function, and kidney function test results like a pro.",
    author: "Dr. Rohit Sharma",
    category: "Test Education",
    date: "Feb 28, 2026",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "Why Regular Health Check-ups Matter After 30",
    excerpt: "Preventive healthcare can detect diseases early when they're most treatable. Discover which tests you should get annually based on your age and risk factors.",
    author: "Dr. Priya Deshmukh",
    category: "Preventive Care",
    date: "Feb 20, 2026",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "Thyroid Disorders: Symptoms, Tests & Management",
    excerpt: "Thyroid problems affect millions of Indians but often go undiagnosed. Learn about T3, T4, TSH tests and what abnormal levels mean for your health.",
    author: "Dr. Amit Patel",
    category: "Health Conditions",
    date: "Feb 14, 2026",
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "Diabetes: HbA1c vs Fasting Blood Sugar",
    excerpt: "Both tests measure blood sugar but work differently. Understand when to use each test, what the numbers mean, and how to track your diabetes management.",
    author: "Dr. Neha Gupta",
    category: "Test Education",
    date: "Feb 8, 2026",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "Vitamin D Deficiency: The Silent Epidemic in India",
    excerpt: "Despite abundant sunshine, over 70% of Indians are Vitamin D deficient. Learn the symptoms, risk factors, testing options, and how to fix low levels.",
    author: "Dr. Rohit Sharma",
    category: "Nutrition",
    date: "Jan 30, 2026",
    readTime: "5 min read",
  },
  {
    id: 6,
    title: "How to Prepare for Common Lab Tests",
    excerpt: "Should you fast before a blood test? How much water can you drink? Clear, simple answers for CBC, lipid profile, sugar tests, and more.",
    author: "Dr. Priya Deshmukh",
    category: "Test Preparation",
    date: "Jan 22, 2026",
    readTime: "4 min read",
  },
  {
    id: 7,
    title: "Heart Health: Understanding Your Lipid Profile",
    excerpt: "Cholesterol, triglycerides, HDL, LDL — know what each cardiac marker means, what healthy ranges look like, and when you should be concerned.",
    author: "Dr. Amit Patel",
    category: "Heart Health",
    date: "Jan 15, 2026",
    readTime: "9 min read",
  },
  {
    id: 8,
    title: "Pregnancy Tests & Prenatal Screening Guide",
    excerpt: "From confirmation tests to trimester-specific screenings, a complete walkthrough of every test recommended during pregnancy and what to expect.",
    author: "Dr. Neha Gupta",
    category: "Women's Health",
    date: "Jan 8, 2026",
    readTime: "12 min read",
  },
  {
    id: 9,
    title: "Monsoon Health: Tests You Should Get This Season",
    excerpt: "Monsoon brings waterborne and vector-borne diseases. Know which diagnostic tests can help you stay protected during the rainy season.",
    author: "Dr. Rohit Sharma",
    category: "Seasonal Health",
    date: "Jan 2, 2026",
    readTime: "5 min read",
  },
];

const categories = ["All", ...new Set(blogPosts.map((p) => p.category))];

const Blogs = () => {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = blogPosts[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-primary py-14 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4">
            {t.blogsTitle}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            {t.blogsSubtitle}
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden md:flex">
            <div className="md:w-2/5 bg-gradient-primary flex items-center justify-center p-10">
              <span className="text-6xl font-heading font-extrabold text-primary-foreground/20">{t.featured}</span>
            </div>
            <div className="p-8 md:w-3/5 flex flex-col justify-center">
              <span className="text-xs font-semibold text-primary border border-primary/30 bg-primary/5 px-3 py-1 rounded-full self-start mb-3">
                {featured.category}
              </span>
              <h2 className="font-heading font-extrabold text-foreground text-2xl mb-3 leading-snug">
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{featured.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{featured.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.searchBlogs}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>
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
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <article
                key={post.id}
                className="bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-primary border border-primary/30 bg-primary/5 px-3 py-1 rounded-full self-start mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    </div>
                    <span className="flex items-center gap-1 text-primary font-semibold cursor-pointer hover:underline">
                      Read <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No blog posts found matching your search.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;

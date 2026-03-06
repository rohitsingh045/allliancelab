import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { fetchHealthConditionBySlug } from "@/api/client.js";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import NotFound from "./NotFound.jsx";

const HealthConditionDetail = () => {
  const { slug } = useParams();

  const { data: condition, isLoading, error } = useQuery({
    queryKey: ["healthCondition", slug],
    queryFn: () => fetchHealthConditionBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !condition) return <NotFound />;

  const relatedTests = condition.relatedTests || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/#health-conditions" className="hover:text-foreground transition-colors">
            Health Conditions
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{condition.label}</span>
        </nav>
      </div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-secondary to-primary/5 border-y border-border">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4 max-w-3xl">
            {condition.title}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
            {condition.description}
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <Accordion type="single" collapsible defaultValue="section-0" className="space-y-3">
          {condition.sections.map((section, i) => (
            <AccordionItem
              key={i}
              value={`section-${i}`}
              className="border border-border rounded-xl px-6 bg-card"
            >
              <AccordionTrigger className="text-lg font-heading font-semibold text-primary hover:no-underline py-5">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {section.content.split("\n\n").map((paragraph, j) => (
                  <p key={j} className="mb-3 last:mb-0">
                    {paragraph.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={k} className="text-foreground font-semibold">
                          {part.slice(2, -2)}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Related Tests */}
      {relatedTests.length > 0 && (
        <section className="bg-secondary/50 border-t border-border">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
              Recommended Tests
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTests.map((test) => (
                <div
                  key={test._id}
                  className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    {test.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{test.parameters} Parameters</span>
                    <span className="font-bold text-primary text-base">₹{test.price}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Report: {test.reportTime} • {test.prerequisites}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default HealthConditionDetail;

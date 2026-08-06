import RuleCard from "./RuleCard";

export interface RuleCategory {
  id: string;
  title: string;
  description?: string;
  rules: Rule[];
}

export interface Rule {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface RuleCategorySectionProps {
  categories: RuleCategory[];
}

export default function RuleCategorySection({
  categories,
}: Readonly<RuleCategorySectionProps>) {
  return (
    <section className="bg-slate-900 py-24">

      <div className="container">

        <div className="space-y-16">

          {categories.map((category) => (

            <section
              key={category.id}
              id={category.id}
            >

              {/* Category Header */}

              <div className="mb-10">

                <h2 className="text-3xl font-black text-white">
                  {category.title}
                </h2>

                {category.description && (
                  <p className="mt-4 max-w-3xl leading-8 text-slate-400">
                    {category.description}
                  </p>
                )}

              </div>

              {/* Rules */}

              <div className="space-y-6">

                {category.rules
                  .sort((a, b) => a.order - b.order)
                  .map((rule) => (

                    <RuleCard
                      key={rule.id}
                      title={rule.title}
                      content={rule.content}
                    />

                  ))}

              </div>

            </section>

          ))}

        </div>

      </div>

    </section>
  );
}
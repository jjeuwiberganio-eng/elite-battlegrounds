import type { Metadata } from "next";

import {
  getTournamentRules,
  getRuleCategories,
} from "@/actions/rules";

import PageHeader from "@/components/admin/shared/PageHeader";
import RulesOverviewCard from "@/components/admin/rules/RulesOverviewCard";
import RulesCategoryFilter from "@/components/admin/rules/RulesCategoryFilter";
import RulesTable from "@/components/admin/rules/RulesTable";
import AddRuleButton from "@/components/admin/rules/AddRuleButton";

export const metadata: Metadata = {
  title: "Tournament Rules",
};

export const revalidate = 30;

export default async function AdminRulesPage() {
  const [
    rules,
    categories,
  ] = await Promise.all([
    getTournamentRules(),
    getRuleCategories(),
  ]);

  return (
    <div className="space-y-8">

      <PageHeader
        title="Tournament Rules"
        description="Manage every rule that appears on the public website."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Rules",
          },
        ]}
      />

      <RulesOverviewCard
        totalRules={rules.length}
        totalCategories={categories.length}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <RulesCategoryFilter
          categories={categories}
        />

        <AddRuleButton />

      </div>

      <RulesTable
        rules={rules}
      />

    </div>
  );
}
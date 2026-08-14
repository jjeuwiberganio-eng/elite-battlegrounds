interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
}: Readonly<PageHeaderProps>) {
  return (
    <div className="space-y-4">
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm"
        >
          {breadcrumbs.map((breadcrumb, index) => (
            <div
              key={`${breadcrumb.label}-${index}`}
              className="flex items-center gap-2"
            >
              {breadcrumb.href ? (
                <a
                  href={breadcrumb.href}
                  className="text-slate-500 transition hover:text-amber-400"
                >
                  {breadcrumb.label}
                </a>
              ) : (
                <span className="font-medium text-slate-300">
                  {breadcrumb.label}
                </span>
              )}

              {index < breadcrumbs.length - 1 && (
                <span className="text-slate-600">/</span>
              )}
            </div>
          ))}
        </nav>
      )}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          Super Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

const spinnerSizes = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export default function LoadingSpinner({
  size = "md",
  text,
  fullScreen = false,
}: Readonly<LoadingSpinnerProps>) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">

      <div
        className={[
          "animate-spin",
          "rounded-full",
          "border-slate-700",
          "border-t-amber-500",
          spinnerSizes[size],
        ].join(" ")}
        role="status"
        aria-label="Loading"
      />

      {text && (
        <p className="text-sm font-medium text-slate-400">
          {text}
        </p>
      )}

      <span className="sr-only">
        Loading...
      </span>

    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
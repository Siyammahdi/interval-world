type Step = 1 | 2 | 3 | 4;

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Select Unit" },
  { n: 2, label: "Details" },
  { n: 3, label: "Payment" },
  { n: 4, label: "Confirmation" },
];

type Props = {
  current: Step;
};

export function CheckoutStepper({ current }: Props) {
  return (
    <div className="mb-8">
      <h1 className="mb-6 text-center text-2xl font-semibold tracking-wide text-slate-400">
        Checkout
      </h1>
      <ol className="mx-auto flex max-w-2xl items-start justify-between px-2">
        {STEPS.map((step, i) => {
          const done = step.n < current;
          const active = step.n === current;
          return (
            <li key={step.n} className="relative flex flex-1 flex-col items-center">
              {i < STEPS.length - 1 ? (
                <span
                  className={`absolute left-[calc(50%+1.1rem)] right-[calc(-50%+1.1rem)] top-4 h-0.5 ${
                    step.n < current ? "bg-iw-blue" : "bg-white/70"
                  }`}
                  aria-hidden
                />
              ) : null}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  done
                    ? "bg-white text-iw-blue"
                    : active
                      ? "bg-iw-blue text-white"
                      : "border-2 border-white/80 bg-transparent text-white"
                }`}
              >
                {done ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.n
                )}
              </span>
              <span
                className={`mt-2 text-center text-[11px] font-medium sm:text-xs ${
                  active ? "text-white" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

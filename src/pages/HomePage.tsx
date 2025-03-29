import { Loader } from "components";
import { lazy, Suspense } from "react";

const DashboardLazy = lazy(() =>
  import("components").then((module) => ({ default: module.Dashboard }))
);

export function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardLazy />
    </Suspense>
  );
}

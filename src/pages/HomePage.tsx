import { lazy, Suspense } from "react";
import { Loader } from "@/components";

const DashboardLazy = lazy(() =>
  import("@/components").then((module) => ({ default: module.Dashboard }))
);

export function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardLazy />
    </Suspense>
  );
}

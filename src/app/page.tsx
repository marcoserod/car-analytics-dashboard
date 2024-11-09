import Dashboard from "@/components/dashboard";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <Dashboard />
    </Suspense>
  );
}

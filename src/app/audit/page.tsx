import { Suspense } from 'react';
import AuditFlow from './AuditFlow';

// useSearchParams() impose une frontière Suspense côté App Router.
export default function AuditPage() {
  return (
    <Suspense
      fallback={
        <main className="screen">
          <div className="container" />
        </main>
      }
    >
      <AuditFlow />
    </Suspense>
  );
}

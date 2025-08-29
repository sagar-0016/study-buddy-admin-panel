import type { Metadata } from 'next';
import DashboardOverview from '@/components/dashboard/dashboard-overview';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance Dashboard</h1>
        <p className="text-muted-foreground">
          Visualize your journey and track your progress across all study areas.
        </p>
      </div>
      <DashboardOverview />
    </div>
  );
}

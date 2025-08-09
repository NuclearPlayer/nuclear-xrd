import { createFileRoute } from '@tanstack/react-router';

const DashboardComponent = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to Nuclear XRD! This is the main dashboard.</p>
    </div>
  );
};

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
});

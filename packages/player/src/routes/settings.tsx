import { createFileRoute } from '@tanstack/react-router';

const SettingsComponent = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Settings page content goes here...</p>
    </div>
  );
};

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
});

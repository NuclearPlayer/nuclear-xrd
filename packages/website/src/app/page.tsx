'use client';

import { Box } from '../components/Box';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Box variant="primary" shadow="default" className="max-w-md">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Nuclear Website</h1>
          <p className="text-foreground-secondary">
            This is a test page for the Nuclear website deployed to GitHub
            Pages. The Box component is working correctly!
          </p>
          <div className="bg-background-secondary mt-4 rounded p-4">
            <p className="text-sm">
              Built with Next.js and using the shared UI components from the
              monorepo.
            </p>
          </div>
        </div>
      </Box>
    </main>
  );
}

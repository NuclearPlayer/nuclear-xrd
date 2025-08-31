export const fakePluginManifest = JSON.stringify({
  name: 'nuclear-fake=plugin',
  version: '0.1.0',
  description: 'Fake plugin for testing',
  main: 'index.ts',
  license: 'AGPL-3.0-only',
  author: 'nukeop',
  keywords: ['nuclear', 'test'],
  nuclear: {
    displayName: 'Fake plugin',
    category: 'Robbing ships on the high seas',
    icon: {
      type: 'link',
      link: 'https://example.com/icon.png',
    },
    permissions: [],
  },
});

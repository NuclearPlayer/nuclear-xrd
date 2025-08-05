import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';

import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';
import { Button } from '@nuclearplayer/ui';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    setGreetMsg(await invoke('greet', { name }));
  }

  useEffect(() => {
    new NuclearPluginAPI().ping().then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Nuclear Player</h1>

      <div className="space-y-4">
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
          className="border border-gray-300 rounded px-3 py-2"
        />
        <Button onClick={() => greet()}>Greet</Button>
        <p>{greetMsg}</p>
      </div>
    </div>
  );
}

export default App;

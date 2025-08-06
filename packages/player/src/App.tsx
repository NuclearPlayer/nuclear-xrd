import { useEffect } from 'react';

import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';
import {
  BottomBar,
  PlayerShell,
  PlayerWorkspace,
  TopBar,
} from '@nuclearplayer/ui';

import { useLayoutStore } from './stores/layoutStore';

function App() {
  const {
    leftSidebar,
    rightSidebar,
    toggleLeftSidebar,
    toggleRightSidebar,
    setLeftSidebarWidth,
    setRightSidebarWidth,
  } = useLayoutStore();

  useEffect(() => {
    new NuclearPluginAPI().ping().then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <PlayerShell>
      <TopBar />

      <PlayerWorkspace>
        <PlayerWorkspace.LeftSidebar
          width={leftSidebar.width}
          isCollapsed={leftSidebar.isCollapsed}
          onWidthChange={setLeftSidebarWidth}
          onToggle={toggleLeftSidebar}
        />

        <PlayerWorkspace.Main />

        <PlayerWorkspace.RightSidebar
          width={rightSidebar.width}
          isCollapsed={rightSidebar.isCollapsed}
          onWidthChange={setRightSidebarWidth}
          onToggle={toggleRightSidebar}
        />
      </PlayerWorkspace>

      <BottomBar />
    </PlayerShell>
  );
}

export default App;

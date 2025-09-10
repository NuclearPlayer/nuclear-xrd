import { StoryObj } from '@storybook/react-vite';

import { Loader } from '@nuclearplayer/ui';

const meta = { title: 'Components/Loader', component: Loader };

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const LG: Story = {
  args: { size: 'lg' },
};

export const XL: Story = {
  args: { size: 'xl' },
};

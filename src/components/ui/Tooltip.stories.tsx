import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './Tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    description: { control: 'text' },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'Tooltip text',
    position: 'top',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
  },
};

export const WithDescription: Story = {
  args: {
    content: 'Tooltip title',
    description: 'This is a longer description that provides more context',
    position: 'top',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
  },
};

export const Bottom: Story = {
  args: {
    content: 'Bottom tooltip',
    position: 'bottom',
    children: <button className="px-4 py-2 bg-green-500 text-white rounded">Hover me</button>,
  },
};

export const Left: Story = {
  args: {
    content: 'Left tooltip',
    position: 'left',
    children: <button className="px-4 py-2 bg-purple-500 text-white rounded">Hover me</button>,
  },
};

export const Right: Story = {
  args: {
    content: 'Right tooltip',
    position: 'right',
    children: <button className="px-4 py-2 bg-orange-500 text-white rounded">Hover me</button>,
  },
};

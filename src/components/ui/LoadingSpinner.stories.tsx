import type { Meta, StoryObj } from '@storybook/react';
import LoadingSpinner from './LoadingSpinner';

const meta = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'white'],
    },
    text: { control: 'text' },
    fullScreen: { control: 'boolean' },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    color: 'primary',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    color: 'primary',
  },
};

export const WithText: Story = {
  args: {
    size: 'md',
    color: 'primary',
    text: 'Loading...',
  },
};

export const Secondary: Story = {
  args: {
    size: 'md',
    color: 'secondary',
  },
};

export const White: Story = {
  args: {
    size: 'md',
    color: 'white',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

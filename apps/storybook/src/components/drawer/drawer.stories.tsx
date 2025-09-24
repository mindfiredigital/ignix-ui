import { useState } from 'react';
import { Drawer, type DrawerProps } from './index';

export default {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['left', 'right', 'top', 'bottom'],
    },
    size: {
      control: { type: 'text' },
      description: 'Can be string (px, %, etc.) or number',
    },
    showOverlay: {
      control: { type: 'boolean' },
    },
    closeOnOverlayClick: {
      control: { type: 'boolean' },
    },
    animationType: {
      control: { type: 'select' },
      options: ['slide', 'reveal', 'fade', 'hinge', 'zoom', 'flip'],
    },
    zIndex: {
      control: { type: 'number' },
    },
  },
};

export const Default = {
  args: {
    isOpen: false,
    children: 'Drawer content goes here',
    position: 'right',
    size: '350px',
    showOverlay: true,
    closeOnOverlayClick: true,
    animationType: 'slide',
    zIndex: 1000,
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Drawer
        </button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const WithTitle = {
  args: {
    ...Default.args,
    title: 'Drawer Title',
    children: 'This drawer has a title and custom content.',
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Drawer with Title
        </button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const WithFooter = {
  args: {
    ...Default.args,
    title: 'Settings',
    children: 'Drawer content with settings options.',
    footer: (
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          Cancel
        </button>
      </div>
    ),
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Drawer with Footer
        </button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const LeftPosition = {
  args: {
    ...Default.args,
    position: 'left',
    size: '300px',
    title: 'Left Drawer',
    children: 'This drawer slides in from the left side.',
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Left Drawer
        </button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const TopPosition = {
  args: {
    ...Default.args,
    position: 'top',
    size: '200px',
    title: 'Top Drawer',
    children: 'This drawer slides down from the top.',
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Top Drawer
        </button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const BottomPosition = {
  args: {
    ...Default.args,
    position: 'bottom',
    size: '250px',
    title: 'Bottom Drawer',
    children: 'This drawer slides up from the bottom.',
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Bottom Drawer
        </button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const NoOverlay = {
  args: {
    ...Default.args,
    showOverlay: false,
    title: 'No Overlay',
    children: 'This drawer has no overlay background.',
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Drawer (No Overlay)
        </button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const NoOverlayClick = {
  args: {
    ...Default.args,
    closeOnOverlayClick: false,
    title: 'No Overlay Click',
    children: 'Clicking the overlay will not close this drawer.',
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Drawer (No Overlay Click)
        </button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const DifferentSizes = {
  args: {
    ...Default.args,
    title: 'Different Sizes',
    children: 'This drawer demonstrates different sizing options.',
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSize, setCurrentSize] = useState('250px');
    
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentSize('250px');
              setIsOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Open Small (250px)
          </button>
          <button
            onClick={() => {
              setCurrentSize('400px');
              setIsOpen(true);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Open Medium (400px)
          </button>
          <button
            onClick={() => {
              setCurrentSize('600px');
              setIsOpen(true);
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Open Large (600px)
          </button>
        </div>
        <Drawer
          {...args}
          size={currentSize}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`Drawer (${currentSize})`}
        >
          <p>This is a drawer with {currentSize} width.</p>
        </Drawer>
      </div>
    );
  },
};

export const AnimationTypes = {
  args: {
    ...Default.args,
    title: 'Animation Demo',
    children: 'This drawer shows different animation types.',
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentAnimation, setCurrentAnimation] = useState<'slide' | 'reveal' | 'fade' | 'hinge' | 'zoom' | 'flip'>('slide');
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setCurrentAnimation('slide');
              setIsOpen(true);
            }}
            className="px-3 py-2 bg-red-500 text-white rounded text-sm"
          >
            Slide
          </button>
          <button
            onClick={() => {
              setCurrentAnimation('reveal');
              setIsOpen(true);
            }}
            className="px-3 py-2 bg-orange-500 text-white rounded text-sm"
          >
            Reveal
          </button>
          <button
            onClick={() => {
              setCurrentAnimation('fade');
              setIsOpen(true);
            }}
            className="px-3 py-2 bg-yellow-500 text-white rounded text-sm"
          >
            Fade
          </button>
          <button
            onClick={() => {
              setCurrentAnimation('hinge');
              setIsOpen(true);
            }}
            className="px-3 py-2 bg-green-500 text-white rounded text-sm"
          >
            Hinge
          </button>
          <button
            onClick={() => {
              setCurrentAnimation('zoom');
              setIsOpen(true);
            }}
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
          >
            Zoom
          </button>
          <button
            onClick={() => {
              setCurrentAnimation('flip');
              setIsOpen(true);
            }}
            className="px-3 py-2 bg-purple-500 text-white rounded text-sm"
          >
            Flip
          </button>
        </div>
        <Drawer
          {...args}
          animationType={currentAnimation}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`${currentAnimation.charAt(0).toUpperCase() + currentAnimation.slice(1)} Animation`}
        >
          <p>{currentAnimation} animation - the drawer uses the {currentAnimation} animation effect.</p>
        </Drawer>
      </div>
    );
  },
};

export const InteractiveDemo = {
  args: {
    ...Default.args,
    title: 'Interactive Demo',
    children: 'This is a fully interactive demo with multiple controls.',
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
    const [size, setSize] = useState('350px');
    const [animationType, setAnimationType] = useState<'slide' | 'reveal' | 'fade' | 'hinge' | 'zoom' | 'flip'>('slide');
    const [showOverlay, setShowOverlay] = useState(true);
    const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Open Drawer
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close Drawer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as 'left' | 'right' | 'top' | 'bottom')}
              className="w-full p-2 border rounded"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., 350px, 50%, 400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Animation</label>
            <select
              value={animationType}
              onChange={(e) => setAnimationType(e.target.value as 'slide' | 'reveal' | 'fade' | 'hinge' | 'zoom' | 'flip')}
              className="w-full p-2 border rounded"
            >
              <option value="slide">Slide</option>
              <option value="reveal">Reveal</option>
              <option value="fade">Fade</option>
              <option value="hinge">Hinge</option>
              <option value="zoom">Zoom</option>
              <option value="flip">Flip</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Overlay</label>
            <div className="flex gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showOverlay}
                  onChange={(e) => setShowOverlay(e.target.checked)}
                  className="mr-2"
                />
                Show
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={closeOnOverlayClick}
                  onChange={(e) => setCloseOnOverlayClick(e.target.checked)}
                  className="mr-2"
                />
                Click to Close
              </label>
            </div>
          </div>
        </div>

        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          position={position}
          size={size}
          animationType={animationType}
          showOverlay={showOverlay}
          closeOnOverlayClick={closeOnOverlayClick}
          title="Interactive Drawer Demo"
        >
          <div className="space-y-4">
            <p>This is an interactive demo showcasing all the drawer features.</p>
            <div className="p-4 bg-gray-100 rounded">
              <h4 className="font-semibold mb-2">Current Settings:</h4>
              <ul className="text-sm space-y-1">
                <li>Position: {position}</li>
                <li>Size: {size}</li>
                <li>Animation: {animationType}</li>
                <li>Overlay: {showOverlay ? 'Visible' : 'Hidden'}</li>
                <li>Overlay Click: {closeOnOverlayClick ? 'Enabled' : 'Disabled'}</li>
              </ul>
            </div>
            <p>Try changing the settings above to see how the drawer behaves differently!</p>
          </div>
        </Drawer>
      </div>
    );
  },
};

export const ComplexContent = {
  args: {
    ...Default.args,
    title: 'Complex Content',
    children: (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900">User Profile</h3>
          <p className="text-blue-700">This drawer contains complex content with multiple elements.</p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter name"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            placeholder="Enter email"
          />
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Save Changes
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    ),
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Complex Content Drawer
        </button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};
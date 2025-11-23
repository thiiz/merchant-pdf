import React from 'react';

interface EditorLayoutProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  leftPanel,
  centerPanel,
  rightPanel,
}) => {
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans text-gray-900">
      {/* Left Panel: Structure & Navigation */}
      <div className="w-[280px] h-full shrink-0 bg-white border-r border-gray-200 z-10 flex flex-col">
        {leftPanel}
      </div>

      {/* Center Panel: Canvas */}
      <div className="flex-1 h-full overflow-hidden bg-gray-100 relative flex flex-col">
        {centerPanel}
      </div>

      {/* Right Panel: Properties */}
      <div className="w-[320px] h-full shrink-0 bg-white border-l border-gray-200 z-10 flex flex-col">
        {rightPanel}
      </div>
    </div>
  );
};

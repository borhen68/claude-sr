"use client";
import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import EditorToolbar from '@/components/editor/EditorToolbar';
import LeftSidebar from '@/components/editor/LeftSidebar';
import EditorCanvas from '@/components/editor/EditorCanvas';
import RightSidebar from '@/components/editor/RightSidebar';
import PageTimeline from '@/components/editor/PageTimeline';

export default function EditorPage({ params }: { params: { id: string } }) {
  const { setProject } = useEditorStore();

  useEffect(() => {
    // Initialize with a sample project
    setProject({
      id: params.id,
      name: 'My Photo Book',
      size: '8x8',
      coverType: 'hardcover',
      paperType: 'matte',
      pages: [
        {
          id: 'page-1',
          number: 1,
          width: 800,
          height: 800,
          elements: [],
          background: '#ffffff',
        },
        {
          id: 'page-2',
          number: 2,
          width: 800,
          height: 800,
          elements: [],
          background: '#ffffff',
        },
      ],
    });
  }, [params.id, setProject]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top Toolbar */}
      <EditorToolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Canvas Area */}
        <EditorCanvas />

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Bottom Timeline */}
      <PageTimeline />
    </div>
  );
}

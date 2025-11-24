import { useCatalogStore } from '@/store/catalogStore';
import { useDroppable } from '@dnd-kit/core';
import { Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';

export const CoverPagePreview = () => {
  const { coverPage, setCoverPage, removeCoverPage, selectItem, selectedType } = useCatalogStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isOver, setNodeRef } = useDroppable({
    id: 'cover-page-drop-zone',
    data: {
      type: 'cover-page',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverPage({ imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverPage({ imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isSelected = selectedType === 'global'; // Cover page is part of global settings context usually, or we can make a specific one

  return (
    <div 
      ref={setNodeRef}
      className={`
        relative w-[210mm] h-[297mm] bg-white shadow-lg transition-all duration-200 group
        ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}
        ${isOver ? 'ring-4 ring-green-500 scale-[1.02]' : ''}
      `}
      onClick={() => selectItem('global', 'cover-page')}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Label */}
      <div className="absolute -top-8 left-0 text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
        <span>📄 Capa do Catálogo</span>
      </div>

      {coverPage?.imageUrl ? (
        <>
          {/* Fullscreen Image */}
          <img 
            src={coverPage.imageUrl} 
            alt="Capa" 
            className="w-full h-full object-cover origin-center"
          />
          
          {/* Overlay Controls (Visible on Hover) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 text-gray-700 transition-transform hover:scale-110"
                title="Trocar Imagem"
              >
                <ImageIcon size={20} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeCoverPage();
                }}
                className="bg-white p-3 rounded-full shadow-lg hover:bg-red-50 text-red-500 transition-transform hover:scale-110"
                title="Remover Capa"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div 
          className="w-full h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 m-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload size={40} className="text-gray-300 group-hover:text-blue-400" />
          </div>
          <p className="text-lg font-medium text-gray-500">Adicionar Capa</p>
          <p className="text-sm mt-2">Arraste uma imagem ou clique para selecionar</p>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

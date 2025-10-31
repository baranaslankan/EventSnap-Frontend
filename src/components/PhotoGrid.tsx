import React from 'react'
import { Badge } from './ui/badge'
import { Download, Tag, Trash2 } from 'lucide-react'

export default function PhotoGrid({ photos, onTag, onPhotoClick, onDelete }: { photos:any[], onTag?: (photoId:string, guestId:string)=>void, onPhotoClick?: (photo:any)=>void, onDelete?: (photoId:string)=>void }){
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {photos.map((p, idx) => (
        <div 
          key={p.id} 
          className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] animate-fadeIn" 
          style={{animationDelay: `${idx * 30}ms`}}
          onClick={() => onPhotoClick?.(p)}
        >
          <div className="aspect-square relative overflow-hidden bg-gray-50 rounded-2xl">
            <img 
              src={p.url} 
              alt="Photo" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-2xl" 
            />
            
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 rounded-2xl" />
            
            
            {(p.tags?.length || 0) > 0 && (
              <div className="absolute left-3 top-3">
                <Badge className="bg-white/90 text-[var(--text)] border-white/70">{p.tags.length} tagged</Badge>
              </div>
            )}

            
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 flex items-center gap-2">
              <a href={p.url} download onClick={(e) => e.stopPropagation()} className="w-10 h-10 bg-[var(--surface)]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                <Download className="w-5 h-5 text-gray-700" />
              </a>
              {onTag && (
                <button onClick={(e)=>{ e.stopPropagation(); onTag(p.id, ''); }} className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                  <Tag className="w-4 h-4 text-gray-700" />
                </button>
              )}
              {onDelete && (
                <button onClick={(e)=>{ e.stopPropagation(); onDelete(p.id); }} className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all" style={{backgroundColor: 'var(--error)'}}>
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

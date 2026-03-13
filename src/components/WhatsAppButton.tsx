import { useEffect, useRef, useState} from'react';

const STORAGE_KEY ='whatsapp-btn-position';
const DEFAULT_POS = { x: window.innerWidth - 80, y: window.innerHeight - 80};

function clamp(value: number, min: number, max: number) {
 return Math.min(Math.max(value, min), max);
}

export default function WhatsAppButton() {
 const phone ='355684030204';
 const message = encodeURIComponent('Hello! I am interested in your travel packages.');
 const url =`https://wa.me/${phone}?text=${message}`;

 const stored = (() => {
 try {
 const raw = localStorage.getItem(STORAGE_KEY);
 return raw ? JSON.parse(raw) : null;
} catch {
 return null;
}
})();

 const [pos, setPos] = useState<{ x: number; y: number}>(stored ?? DEFAULT_POS);
 const [dragging, setDragging] = useState(false);
 const [hasDragged, setHasDragged] = useState(false);

 const btnRef = useRef<HTMLDivElement>(null);
 const dragStart = useRef<{ mx: number; my: number; bx: number; by: number} | null>(null);
 const SIZE = 56;

 const constrainPos = (x: number, y: number) => ({
 x: clamp(x, 0, window.innerWidth - SIZE),
 y: clamp(y, 0, window.innerHeight - SIZE),
});

 useEffect(() => {
 const onResize = () => {
 setPos((p) => constrainPos(p.x, p.y));
};
 window.addEventListener('resize', onResize);
 return () => window.removeEventListener('resize', onResize);
}, []);

 const savePos = (x: number, y: number) => {
 localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y}));
};

 const onMouseDown = (e: React.MouseEvent) => {
 e.preventDefault();
 dragStart.current = { mx: e.clientX, my: e.clientY, bx: pos.x, by: pos.y};
 setDragging(true);
 setHasDragged(false);
};

 const onTouchStart = (e: React.TouchEvent) => {
 const t = e.touches[0];
 dragStart.current = { mx: t.clientX, my: t.clientY, bx: pos.x, by: pos.y};
 setDragging(true);
 setHasDragged(false);
};

 useEffect(() => {
 if (!dragging) return;

 const onMouseMove = (e: MouseEvent) => {
 if (!dragStart.current) return;
 const dx = e.clientX - dragStart.current.mx;
 const dy = e.clientY - dragStart.current.my;
 if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setHasDragged(true);
 const next = constrainPos(dragStart.current.bx + dx, dragStart.current.by + dy);
 setPos(next);
};

 const onMouseUp = (e: MouseEvent) => {
 if (!dragStart.current) return;
 const dx = e.clientX - dragStart.current.mx;
 const dy = e.clientY - dragStart.current.my;
 const next = constrainPos(dragStart.current.bx + dx, dragStart.current.by + dy);
 setPos(next);
 savePos(next.x, next.y);
 dragStart.current = null;
 setDragging(false);
};

 const onTouchMove = (e: TouchEvent) => {
 e.preventDefault();
 if (!dragStart.current) return;
 const t = e.touches[0];
 const dx = t.clientX - dragStart.current.mx;
 const dy = t.clientY - dragStart.current.my;
 if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setHasDragged(true);
 const next = constrainPos(dragStart.current.bx + dx, dragStart.current.by + dy);
 setPos(next);
};

 const onTouchEnd = (e: TouchEvent) => {
 if (!dragStart.current) return;
 const t = e.changedTouches[0];
 const dx = t.clientX - dragStart.current.mx;
 const dy = t.clientY - dragStart.current.my;
 const next = constrainPos(dragStart.current.bx + dx, dragStart.current.by + dy);
 setPos(next);
 savePos(next.x, next.y);
 dragStart.current = null;
 setDragging(false);
};

 window.addEventListener('mousemove', onMouseMove);
 window.addEventListener('mouseup', onMouseUp);
 window.addEventListener('touchmove', onTouchMove, { passive: false});
 window.addEventListener('touchend', onTouchEnd);

 return () => {
 window.removeEventListener('mousemove', onMouseMove);
 window.removeEventListener('mouseup', onMouseUp);
 window.removeEventListener('touchmove', onTouchMove);
 window.removeEventListener('touchend', onTouchEnd);
};
}, [dragging]);

 const handleClick = (e: React.MouseEvent) => {
 if (hasDragged) {
 e.preventDefault();
}
};

 return (
 <div
 ref={btnRef}
 style={{
 position:'fixed',
 left: pos.x,
 top: pos.y,
 width: SIZE,
 height: SIZE,
 zIndex: 50,
 cursor: dragging ?'grabbing' :'grab',
 touchAction:'none',
 userSelect:'none',
}}
 onMouseDown={onMouseDown}
 onTouchStart={onTouchStart}
 >

 <a
 href={url}
 target="_blank"
 rel="noopener noreferrer"
 aria-label="Chat on WhatsApp"
 onClick={handleClick}
 draggable={false}
 className="relative flex items-center justify-center w-full h-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
 style={{
 backgroundColor:'#25D366',
 transform: dragging ?'scale(1.12)' :'scale(1)',
 transition: dragging ?'none' :'transform 0.2s ease, box-shadow 0.2s ease',
 boxShadow: dragging
 ?'0 12px 32px rgba(37,211,102,0.45)'
 :'0 4px 16px rgba(37,211,102,0.35)',
}}
 >
 <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 fill-white pointer-events-none">
 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
 </svg>
 </a>
 </div>
 );
}

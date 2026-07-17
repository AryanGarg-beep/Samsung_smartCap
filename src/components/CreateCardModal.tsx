import { useState } from 'react';
import { X, ImagePlus } from 'lucide-react';

interface CreateCardModalProps {
  onClose: () => void;
  onCreate: (name: string, notes: string | undefined, photo: string | undefined) => void;
}

export function CreateCardModal({ onClose, onCreate }: CreateCardModalProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
  };

  // Creation itself is instant — the card appears right away with a "pending"
  // look (see App.tsx's handleAddCard), and the Coach Agent's product lookup +
  // automation generation happen in the background afterward, patching the
  // card in place whenever they resolve. Nothing here awaits a network call.
  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Give the card a name first.');
      return;
    }
    onCreate(trimmedName, notes.trim() || undefined, photoUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#2D3436]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="pop-in w-full max-w-md bg-white border-4 border-[#2D3436] rounded-[32px] shadow-[0_16px_0_0_#2D3436] relative overflow-hidden flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white border-4 border-[#2D3436] rounded-full flex items-center justify-center shadow-[0_4px_0_0_#2D3436] hover:translate-y-1 hover:shadow-[0_2px_0_0_#2D3436] transition-all z-10"
        >
          <X className="w-5 h-5 text-[#2D3436]" strokeWidth={4} />
        </button>

        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar space-y-4">
          <h2 className="text-2xl font-black text-[#2D3436] tracking-tight mb-2">Add a Card</h2>
          <p className="text-sm font-bold text-slate-500 -mt-2 mb-2">
            The card appears right away. The Coach Agent looks up published specs for this
            product in the background (or falls back to typical guidance for its category) and
            fills the card in once it's done.
          </p>

          <div>
            <label className="text-xs font-black uppercase text-slate-400">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kitchen Exhaust Fan"
              className="mt-1 w-full rounded-xl border-4 border-[#2D3436] px-4 py-3 text-sm font-bold text-[#2D3436] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-400">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Brand, model, anything that helps identify it"
              rows={2}
              className="mt-1 w-full rounded-xl border-4 border-[#2D3436] px-4 py-3 text-sm font-bold text-[#2D3436] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-400">
              Photo (optional, cosmetic only)
            </label>
            <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-4 border-dashed border-[#2D3436] px-4 py-3 text-sm font-bold text-[#2D3436]">
              <ImagePlus className="w-4 h-4" />
              {photoUrl ? 'Change photo' : 'Choose photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
            {photoUrl && (
              <img src={photoUrl} alt="Card preview" className="mt-2 w-full h-32 object-cover rounded-xl border-4 border-[#2D3436]" />
            )}
          </div>

          {error && (
            <div className="rounded-xl border-2 border-[#E74C3C] bg-red-50 px-3 py-2 text-xs font-bold text-[#E74C3C]">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl border-4 border-[#2D3436] text-lg font-black uppercase flex items-center justify-center gap-3 bg-[#9B59B6] text-white shadow-[0_8px_0_0_#2D3436] hover:translate-y-1 hover:shadow-[0_4px_0_0_#2D3436] active:translate-y-2 active:shadow-none transition-all"
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
}

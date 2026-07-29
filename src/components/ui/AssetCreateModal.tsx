import React, { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import UniversalModal from './UniversalModal';
import { AssetCategory, AssetStatus } from '../../types';

interface AssetCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (asset: any) => void | Promise<void>;
  isLoading?: boolean;
}

const CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: 'fleet', label: 'Fleet / Vehicles' },
  { value: 'culinary', label: 'Culinary Equipment' },
  { value: 'comms_security', label: 'Comms & Security' },
  { value: 'tech', label: 'Technology' },
  { value: 'access', label: 'Access Equipment' },
];

export default function AssetCreateModal({
  isOpen,
  onClose,
  onCreate,
  isLoading: externalLoading,
}: AssetCreateModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('fleet');
  const [assetCode, setAssetCode] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const isProcessing = externalLoading ?? internalLoading;

  const resetForm = () => {
    setName('');
    setCategory('fleet');
    setAssetCode('');
    setTags('');
    setNotes('');
  };

  const handleCreate = async () => {
    if (!name.trim() || !assetCode.trim()) return;
    setInternalLoading(true);
    try {
      const now = new Date().toISOString();
      await onCreate({
        id: `asset-${Date.now()}`,
        name: name.trim(),
        category,
        status: 'available' as AssetStatus,
        assetCode: assetCode.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        notes: notes.trim(),
        createdAt: now,
        updatedAt: now,
      });
      resetForm();
      onClose();
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={() => { resetForm(); onClose(); }}
      title="Create Asset"
      size="md"
      variant="auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Package className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">
            Asset Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mercedes S-Class Luxury Sedan"
            disabled={isProcessing}
            className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">
            Asset Code <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={assetCode}
            onChange={(e) => setAssetCode(e.target.value)}
            placeholder="e.g. FLT-001"
            disabled={isProcessing}
            className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as AssetCategory)}
            disabled={isProcessing}
            className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated: luxury, vip, transport"
            disabled={isProcessing}
            className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional details..."
            rows={2}
            disabled={isProcessing}
            className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-6 mt-6 border-t border-outline-variant/10">
        <button
          onClick={() => { resetForm(); onClose(); }}
          disabled={isProcessing}
          className="flex-1 py-3 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={!name.trim() || !assetCode.trim() || isProcessing}
          className="flex-[2] py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create Asset
            </>
          )}
        </button>
      </div>
    </UniversalModal>
  );
}

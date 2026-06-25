import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Edit3 } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void | Promise<void>;
  title: string;
  fields: EditField[];
  initialData: Record<string, any>;
  isLoading?: boolean;
}

export interface EditField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'toggle' | 'email' | 'tel';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  title,
  fields,
  initialData,
  isLoading: externalLoading,
}: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [internalLoading, setInternalLoading] = useState(false);
  const isProcessing = externalLoading ?? internalLoading;

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setInternalLoading(true);
    try {
      await onSave(formData);
    } finally {
      setInternalLoading(false);
    }
  };

  const renderField = (field: EditField) => {
    const value = formData[field.name] ?? '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            disabled={isProcessing}
            className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            disabled={isProcessing}
            className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          >
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case 'toggle':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              disabled={isProcessing}
              className="w-4 h-4 text-primary rounded border-charcoal/20 focus:ring-0 cursor-pointer"
            />
            <span className="text-sm text-on-surface">{field.label}</span>
          </label>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.name, Number(e.target.value))}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            disabled={isProcessing}
            className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        );
      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isProcessing}
            className="w-full p-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !isProcessing) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-parchment rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal">{title}</h3>
              </div>
              {!isProcessing && (
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container transition-colors">
                  <X className="w-4 h-4 text-secondary" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {fields.map(field => (
                <div key={field.name}>
                  {field.type !== 'toggle' && (
                    <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">
                      {field.label}
                      {field.required && <span className="text-error ml-1">*</span>}
                    </label>
                  )}
                  {renderField(field)}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-outline-variant/10">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-3 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="flex-[2] py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

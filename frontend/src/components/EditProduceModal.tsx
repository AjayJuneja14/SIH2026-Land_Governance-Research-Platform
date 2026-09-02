'use client';

import React, { useState } from 'react';
import { api } from '../lib/api';
import { Produce } from '../lib/types';
import { X, Save, AlertCircle } from 'lucide-react';

interface EditProduceModalProps {
  produce: Produce | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProduceModal({ produce, isOpen, onClose, onSuccess }: EditProduceModalProps) {
  if (!isOpen || !produce) return null;

  const [name, setName] = useState(produce.name);
  const [category, setCategory] = useState(produce.category);
  const [quantity, setQuantity] = useState(String(produce.quantity));
  const [unit, setUnit] = useState(produce.unit);
  const [pricePerUnit, setPricePerUnit] = useState(String(produce.pricePerUnit));
  const [qualityGrade, setQualityGrade] = useState(produce.qualityGrade);
  const [status, setStatus] = useState(produce.status);
  const [description, setDescription] = useState(produce.description || '');
  const [imageUrl, setImageUrl] = useState(produce.imageUrl || '');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      const res = await api.updateProduce(produce.id, {
        name,
        category,
        quantity: parseFloat(quantity),
        unit,
        pricePerUnit: parseFloat(pricePerUnit),
        qualityGrade,
        status,
        description,
        imageUrl,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.message || 'Failed to update produce');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Edit Produce Listing</h3>
            <p className="text-xs text-gray-500">Update stock, pricing, or status</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Produce Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="kg">kg</option>
                <option value="quintal">quintal</option>
                <option value="crate">crate</option>
                <option value="dozen">dozen</option>
                <option value="litre">litre</option>
                <option value="piece">piece</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Price per {unit} (₹)</label>
              <input
                type="number"
                min="0.5"
                step="any"
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="SOLD">SOLD</option>
                <option value="RESERVED">RESERVED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Quality Grade</label>
            <input
              type="text"
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

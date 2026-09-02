'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Hub } from '../lib/types';
import { calculatePriceBreakdown, formatCurrency } from '../lib/utils';
import { X, Upload, Sprout, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';

interface AddProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProduceModal({ isOpen, onClose, onSuccess }: AddProduceModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [hubId, setHubId] = useState('');
  const [hubs, setHubs] = useState<Hub[]>([]);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.getAllHubs().then((res) => {
        if (res.success && res.data) {
          setHubs(res.data);
          if (res.data.length > 0) setHubId(res.data[0].id);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const res = await api.uploadImage(file);
      if (res.success && res.data?.url) {
        setImageUrl(res.data.url);
      } else {
        setError('Upload failed: ' + (res.message || 'Unknown error'));
      }
    } catch (err: any) {
      setError('File upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !quantity || !pricePerUnit) {
      setError('Please fill all required fields (Crop Name, Quantity, Price).');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createProduce({
        name,
        category,
        quantity: parseFloat(quantity),
        unit,
        pricePerUnit: parseFloat(pricePerUnit),
        qualityGrade,
        harvestDate: new Date(harvestDate).toISOString(),
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
        hubId: hubId || undefined,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.message || 'Failed to list produce');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const parsedPrice = parseFloat(pricePerUnit) || 0;
  const breakdown = calculatePriceBreakdown(parsedPrice);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">List New Harvest Produce</h3>
              <p className="text-xs text-gray-500">Add fresh batch directly to the KisanConnect marketplace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo Upload Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
              Produce Photo
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-36 h-28 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center relative group">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-gray-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-[10px]">No photo</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                    Uploading...
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 w-full">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl cursor-pointer transition">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Choose Photo File</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <div className="text-[11px] text-gray-400">or enter image URL directly:</div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Crop Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Produce Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Red Tomatoes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains & Cereals</option>
                <option value="Pulses">Pulses & Legumes</option>
                <option value="Spices">Spices & Herbs</option>
                <option value="Dairy">Dairy & Organics</option>
              </select>
            </div>
          </div>

          {/* Quantity, Unit & Base Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Available Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                placeholder="e.g. 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Unit of Measure <span className="text-red-500">*</span>
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="quintal">quintal (100 kg)</option>
                <option value="crate">crate (20-25 kg)</option>
                <option value="dozen">dozen (12 pcs)</option>
                <option value="litre">litre</option>
                <option value="piece">piece</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Your Price per {unit} (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0.5"
                step="any"
                required
                placeholder="e.g. 35"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none font-bold text-emerald-700"
              />
            </div>
          </div>

          {/* Live Price Transparency Calculator */}
          {parsedPrice > 0 && (
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Live Fair Price Calculation
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase">
                  Transparent
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-white p-2 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-gray-500 block">You Receive</span>
                  <strong className="text-emerald-700 text-sm font-black">{formatCurrency(breakdown.farmerPrice)}</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-gray-500 block">Buyer Direct</span>
                  <strong className="text-gray-900 text-sm font-black">{formatCurrency(breakdown.directConsumerPrice)}</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-gray-500 block">Mandi Benchmark</span>
                  <strong className="text-amber-700 text-sm font-black line-through">{formatCurrency(breakdown.traditionalRetailPrice)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Quality Grade & Harvest Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Quality Grade
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="Grade A">Grade A (Premium)</option>
                <option value="Grade B">Grade B (Standard)</option>
                <option value="Organic Certified">Organic Certified (Zero Chemical)</option>
                <option value="Export Quality">Export Quality</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Harvest Date
              </label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Hub Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Local Aggregation / Drop-off Hub
            </label>
            <select
              value={hubId}
              onChange={(e) => setHubId(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white"
            >
              {hubs.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name} ({hub.location})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Notes / Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Naturally sun-ripened, plucked today morning, chemical-free pesticide."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md transition flex items-center gap-2"
            >
              {submitting ? 'Publishing...' : 'Publish to Marketplace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

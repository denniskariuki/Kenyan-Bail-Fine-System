
import React, { useState, useEffect, useRef } from 'react';
import { BailCase, CaseStatus, BailType, CaseCategory } from '../../types';
import { OFFENCE_CATEGORIES, BAIL_TYPES, CASE_CATEGORIES } from '../../constants';
import { checkOffenceEligibility } from '../../services/gemini';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newCase: BailCase) => void;
  station: string;
}

export const AddCaseModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, station }) => {
  const [formData, setFormData] = useState<Partial<BailCase>>({
    obNumber: '',
    detaineeName: '',
    detaineePhone: '',
    detaineeImage: '',
    nationalId: '',
    gender: 'Male',
    ageRange: 'Adult',
    offence: '',
    offenceCategory: OFFENCE_CATEGORIES[0],
    caseCategory: 'Bail' as CaseCategory,
    bailType: 'Cash Bail' as BailType,
    bailAmount: 0,
    courtName: '',
    expectedCourtDate: '',
    arrestDateTime: new Date().toISOString().slice(0, 16),
  });

  const [aiAnalysis, setAiAnalysis] = useState<{ isBailable: boolean; reason: string; suggestedBailRange?: string } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formData.offence && formData.offence.length > 5) {
      const timer = setTimeout(async () => {
        setIsValidating(true);
        const result = await checkOffenceEligibility(formData.offence!);
        setAiAnalysis(result);
        setIsValidating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.offence]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, detaineeImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.obNumber || !formData.detaineeName || !formData.bailAmount) {
      alert("Please fill in all mandatory fields (OB Number, Name, Amount)");
      return;
    }

    const newCase: BailCase = {
      ...formData as BailCase,
      id: `BC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: CaseStatus.OPEN,
      amountRaised: 0,
      station,
      timestamp: new Date().toISOString(),
      contributions: [],
    };

    onSubmit(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Register New Justice Case</h2>
            <p className="text-slate-400 text-sm">Station: {station}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Section 1: Detainee Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">1. Detainee Information</h3>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-40 h-40 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors group relative"
                >
                  {formData.detaineeImage ? (
                    <img src={formData.detaineeImage} alt="Detainee" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <svg className="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Capture Photo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold uppercase">Change Image</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <p className="text-[10px] text-slate-500 font-bold uppercase">Official Photo Required</p>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                  <input required value={formData.detaineeName} onChange={e => setFormData({...formData, detaineeName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter full name" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">National ID</label>
                  <input value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ID Number" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Phone Number (Next of Kin)</label>
                  <input value={formData.detaineePhone} onChange={e => setFormData({...formData, detaineePhone: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="07XXXXXXXX" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Gender</label>
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Age Range</label>
                    <select value={formData.ageRange} onChange={e => setFormData({...formData, ageRange: e.target.value as any})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>Adult</option>
                      <option>Juvenile</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Case Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">2. Case & Offence Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Case Category *</label>
                <select 
                  required 
                  value={formData.caseCategory} 
                  onChange={e => setFormData({...formData, caseCategory: e.target.value as CaseCategory, bailType: e.target.value === 'Fine' ? 'Court Fine' : 'Cash Bail'})} 
                  className="w-full px-4 py-2 border-2 border-blue-100 bg-blue-50 text-blue-900 font-bold rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  {CASE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat} Assistance</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">OB Number *</label>
                <input required value={formData.obNumber} onChange={e => setFormData({...formData, obNumber: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder:italic" placeholder="e.g. OB 23/12/2024" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Incident Date & Time</label>
                <input type="datetime-local" value={formData.arrestDateTime} onChange={e => setFormData({...formData, arrestDateTime: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Specific Offence *</label>
                <textarea required value={formData.offence} onChange={e => setFormData({...formData, offence: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]" placeholder="Detailed description of the offence as per charge sheet..." />
                
                {/* AI Validation UI */}
                <div className={`p-4 rounded-2xl border transition-all ${isValidating ? 'bg-slate-50 border-slate-200 animate-pulse' : aiAnalysis ? (aiAnalysis.isBailable ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100') : 'hidden'}`}>
                  {isValidating ? (
                    <p className="text-xs font-bold text-slate-500">Checking Kenyan Constitution for bailability...</p>
                  ) : aiAnalysis && (
                    <div className="flex gap-3">
                      <div className={`mt-0.5 ${aiAnalysis.isBailable ? 'text-emerald-600' : 'text-red-600'}`}>
                        {aiAnalysis.isBailable ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${aiAnalysis.isBailable ? 'text-emerald-800' : 'text-red-800'}`}>
                          {aiAnalysis.isBailable ? 'Bailable Offence' : 'Potentially Non-Bailable'}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1">{aiAnalysis.reason}</p>
                        {aiAnalysis.suggestedBailRange && (
                          <p className="text-[10px] mt-2 font-bold text-emerald-700 bg-white inline-block px-2 py-1 rounded-md">Suggested Range: {aiAnalysis.suggestedBailRange}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Financials */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">3. Financial Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">{formData.caseCategory} Type</label>
                <select value={formData.bailType} onChange={e => setFormData({...formData, bailType: e.target.value as BailType})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                  {BAIL_TYPES.filter(t => formData.caseCategory === 'Fine' ? t === 'Court Fine' : t !== 'Court Fine').map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Set {formData.caseCategory} Amount (KES) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">KES</span>
                  <input required type="number" value={formData.bailAmount || ''} onChange={e => setFormData({...formData, bailAmount: Number(e.target.value)})} className="w-full pl-12 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono font-bold text-lg" placeholder="0" />
                </div>
                <p className="text-[10px] text-red-500 font-bold mt-1">IMPORTANT: Amount cannot be changed once case is public.</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Assigned Court</label>
                <input value={formData.courtName} onChange={e => setFormData({...formData, courtName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Milimani Law Courts" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Expected Court Date</label>
                <input type="date" value={formData.expectedCourtDate} onChange={e => setFormData({...formData, expectedCourtDate: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t sticky bottom-0 bg-white pb-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
            <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">Submit to Justice Portal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

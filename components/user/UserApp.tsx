
import React, { useState, useEffect } from 'react';
import { BailCase, CaseStatus } from '../../types';
import { Badge } from '../common/Badge';
import { getLegalSummary } from '../../services/gemini';

interface Props {
  cases: BailCase[];
  onUpdateCases: (cases: BailCase[]) => void;
  onBack: () => void;
}

export const UserApp: React.FC<Props> = ({ cases, onUpdateCases, onBack }) => {
  const [view, setView] = useState<'SEARCH' | 'RESULTS' | 'DETAILS' | 'PAY'>('SEARCH');
  const [selectedCase, setSelectedCase] = useState<BailCase | null>(null);
  const [searchResults, setSearchResults] = useState<BailCase[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [legalAid, setLegalAid] = useState<string>('');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Browse all bailable/finable cases logic
  const browseAllCases = () => {
    const activeCases = cases.filter(c => c.status === CaseStatus.OPEN || c.status === CaseStatus.CONTRIBUTING);
    setSearchResults(activeCases);
    setView('RESULTS');
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    const term = searchValue.toLowerCase();
    const matches = cases.filter(c => 
      c.detaineeName.toLowerCase().includes(term) ||
      c.obNumber.toLowerCase().includes(term) ||
      c.detaineePhone === term ||
      c.id.toLowerCase() === term
    );

    if (matches.length === 0) {
      alert("No active cases found for this search. Try a full name or OB number.");
    } else if (matches.length === 1) {
      selectCase(matches[0]);
    } else {
      setSearchResults(matches);
      setView('RESULTS');
    }
  };

  const selectCase = (c: BailCase) => {
    setSelectedCase(c);
    setView('DETAILS');
    fetchLegalAid(c.offence);
  };

  const fetchLegalAid = async (offence: string) => {
    setLegalAid("Analyzing Kenyan law...");
    const text = await getLegalSummary(offence);
    setLegalAid(text || "No specific legal data found.");
  };

  const processPayment = () => {
    if (!selectedCase || payAmount <= 0) return;
    
    const remaining = selectedCase.bailAmount - selectedCase.amountRaised;
    if (payAmount > remaining) {
       alert(`Amount exceeds remaining balance. You only need to pay KES ${remaining.toLocaleString()}.`);
       return;
    }

    setIsProcessing(true);
    // Simulate M-Pesa STK Push
    setTimeout(() => {
      const updatedCase = { ...selectedCase };
      const newAmount = updatedCase.amountRaised + payAmount;
      updatedCase.amountRaised = newAmount;
      updatedCase.contributions = [
        ...updatedCase.contributions,
        {
          id: 'CX-' + Math.random().toString(36).substr(2, 9),
          contributorName: 'Well Wisher',
          contributorType: 'Community' as const,
          amount: payAmount,
          timestamp: new Date().toISOString(),
          mpesaRef: 'MP' + Math.random().toString(36).toUpperCase().substr(2, 8),
          status: 'Verified' as const
        }
      ];

      if (newAmount >= updatedCase.bailAmount) {
        updatedCase.status = CaseStatus.PAID;
      } else {
        updatedCase.status = CaseStatus.CONTRIBUTING;
      }

      onUpdateCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
      setSelectedCase(updatedCase);
      setIsProcessing(false);
      setView('DETAILS');
      alert(`Success! KES ${payAmount} contributed via M-Pesa.`);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col shadow-2xl overflow-hidden font-sans">
      {/* App Header */}
      <header className="bg-emerald-600 p-6 text-white shrink-0">
        <div className="flex items-center justify-between mb-2">
          {view !== 'SEARCH' ? (
            <button onClick={() => setView(view === 'RESULTS' ? 'SEARCH' : (searchResults.length > 1 ? 'RESULTS' : 'SEARCH'))} className="p-1 -ml-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
          ) : (
            <button onClick={onBack} className="p-1 -ml-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
          )}
          <h1 className="text-xl font-bold tracking-tight">Bail & Fine Aid</h1>
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-bold">U</div>
        </div>
        <p className="text-emerald-100 text-sm opacity-90">Helping you secure freedom, fairly.</p>
      </header>

      <main className="flex-1 overflow-y-auto p-5 pb-24">
        {view === 'SEARCH' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Find a Case</h2>
                <p className="text-slate-500 text-sm mt-2">Enter Detainee Name, OB Number, or Phone</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="e.g. John Kamau"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-medium focus:border-emerald-500 focus:bg-white outline-none transition-all"
                />
                <button 
                  onClick={handleSearch}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all"
                >
                  Lookup Case Info
                </button>
              </div>
            </div>

            <div 
              onClick={browseAllCases}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all group"
            >
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900">Browse All Cases</h3>
                   <p className="text-xs text-slate-500">View bails and fines awaiting help</p>
                 </div>
               </div>
               <svg className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
               <h3 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                 Transparency Notice
               </h3>
               <p className="text-blue-800 text-xs leading-relaxed">
                 All contributions are held in a secure justice escrow account. Funds are only transferred to the Judiciary upon full target attainment.
               </p>
            </div>
          </div>
        )}

        {view === 'RESULTS' && (searchResults.length > 0) && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-slate-900 px-1">Found {searchResults.length} detainees</h2>
            <div className="space-y-4">
              {searchResults.map((c) => (
                <button 
                  key={c.id}
                  onClick={() => selectCase(c)}
                  className="w-full text-left bg-white border border-slate-200 rounded-[2rem] hover:border-emerald-500 transition-all group active:scale-[0.98] overflow-hidden shadow-sm"
                >
                  <div className="flex items-center gap-4 p-5">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                      {c.detaineeImage ? (
                        <img src={c.detaineeImage} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 line-clamp-1">{c.detaineeName}</h3>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block w-fit mt-1 ${c.caseCategory === 'Fine' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {c.caseCategory || 'Bail'}
                          </span>
                        </div>
                        <Badge status={c.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{c.station} • {c.obNumber}</p>
                      <div className="mt-3 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Remaining</p>
                          <p className="text-base font-bold text-emerald-600 font-mono">KES {(c.bailAmount - c.amountRaised).toLocaleString()}</p>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-lg">
                          {Math.round((c.amountRaised / c.bailAmount) * 100)}% {c.caseCategory === 'Fine' ? 'PAID' : 'RAISED'}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'DETAILS' && selectedCase && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            {/* Detailed profile image in user view */}
            <div className="w-full aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative">
               {selectedCase.detaineeImage ? (
                  <img src={selectedCase.detaineeImage} alt={selectedCase.detaineeName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                  </div>
                )}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                   <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{selectedCase.detaineeName}</h2>
                        <div className="flex items-center gap-2">
                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${selectedCase.caseCategory === 'Fine' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                             {selectedCase.caseCategory || 'Bail'} CASE
                           </span>
                           <p className="text-slate-500 text-[10px] font-medium">{selectedCase.station}</p>
                        </div>
                      </div>
                      <Badge status={selectedCase.status} />
                   </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
               <div className="flex justify-between items-end border-b pb-4 border-slate-50">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total {selectedCase.caseCategory} Amount</span>
                    <p className="text-xl font-bold text-slate-900 font-mono">KES {selectedCase.bailAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Remaining to Clear</span>
                    <p className="text-2xl font-bold text-emerald-600 font-mono">KES {(selectedCase.bailAmount - selectedCase.amountRaised).toLocaleString()}</p>
                  </div>
               </div>
               
               <div className="space-y-3">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Contribution Progress</span>
                   <span className="font-bold text-emerald-600">{Math.round((selectedCase.amountRaised / selectedCase.bailAmount) * 100)}%</span>
                 </div>
                 <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(selectedCase.amountRaised / selectedCase.bailAmount) * 100}%` }}
                   />
                 </div>
                 <div className="flex justify-between text-xs font-medium">
                   <span className="text-slate-400">Paid so far: KES {selectedCase.amountRaised.toLocaleString()}</span>
                   <span className="text-emerald-500">Need KES {(selectedCase.bailAmount - selectedCase.amountRaised).toLocaleString()} more</span>
                 </div>
               </div>
            </div>

            <div className="p-6 bg-emerald-50 rounded-3xl space-y-3">
              <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Legal Aid Assistant
              </h4>
              <p className="text-emerald-800 text-sm leading-relaxed italic">
                {legalAid}
              </p>
            </div>

            {selectedCase.status !== CaseStatus.PAID && selectedCase.status !== CaseStatus.RELEASED && (
              <button 
                onClick={() => setView('PAY')}
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-100 active:scale-[0.98] transition-all sticky bottom-4 z-10"
              >
                Contribute Now
              </button>
            )}

            {selectedCase.status === CaseStatus.PAID && (
               <div className="p-6 bg-blue-100 rounded-3xl text-center space-y-2 border border-blue-200">
                  <p className="text-blue-900 font-bold">{selectedCase.caseCategory.toUpperCase()} FULLY CLEARED</p>
                  <p className="text-blue-800 text-sm leading-relaxed">Payment verified. The OCS at <b>{selectedCase.station}</b> has been notified to process final release for <b>{selectedCase.detaineeName}</b>.</p>
               </div>
            )}
          </div>
        )}

        {view === 'PAY' && selectedCase && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">M-Pesa Payment</h2>
              <p className="text-slate-500">Supporting {selectedCase.detaineeName}</p>
              <p className="text-emerald-600 font-bold">Remaining for {selectedCase.caseCategory}: KES {(selectedCase.bailAmount - selectedCase.amountRaised).toLocaleString()}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
               <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-500 uppercase">Enter Amount (KES)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 font-bold">KES</span>
                    <input
                      type="number"
                      value={payAmount || ''}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      placeholder="0"
                      className="w-full pl-16 pr-5 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-2xl font-mono focus:border-emerald-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[500, 1000, 2000].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => setPayAmount(amt)}
                        className="flex-1 py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        +{amt}
                      </button>
                    ))}
                    <button 
                      onClick={() => setPayAmount(selectedCase.bailAmount - selectedCase.amountRaised)}
                      className="flex-1 py-2 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl"
                    >
                      FULL BALANCE
                    </button>
                  </div>
               </div>

               <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-xl">M</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">M-Pesa STK Push</p>
                    <p className="text-xs text-emerald-700 opacity-80">Payment held in secure justice escrow.</p>
                  </div>
               </div>

               <button 
                onClick={processPayment}
                disabled={isProcessing || payAmount <= 0}
                className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${isProcessing ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'}`}
               >
                 {isProcessing ? (
                   <>
                     <svg className="animate-spin h-5 w-5 text-slate-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     M-Pesa Prompt Sent...
                   </>
                 ) : (
                   `Pay KES ${payAmount.toLocaleString()}`
                 )}
               </button>
            </div>

            <p className="text-center text-xs text-slate-400 px-8 leading-relaxed italic">
              * Any surplus funds from multi-person contributions are automatically returned to the payer's M-Pesa account.
            </p>
          </div>
        )}
      </main>

      {/* Bottom Nav Simulation */}
      <footer className="h-20 bg-white border-t border-slate-200 flex items-center justify-around px-6 shrink-0 z-20">
         <button onClick={() => { setView('SEARCH'); setSearchResults([]); }} className={`flex flex-col items-center gap-1 ${view === 'SEARCH' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Find</span>
         </button>
         <button onClick={browseAllCases} className={`flex flex-col items-center gap-1 ${view === 'RESULTS' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Help Cases</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">My Ledger</span>
         </button>
      </footer>
    </div>
  );
};

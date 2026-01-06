
import React, { useState } from 'react';
import { BailCase, CaseStatus } from '../../types';
import { Badge } from '../common/Badge';
import { AddCaseModal } from './AddCaseModal';

interface Props {
  cases: BailCase[];
  onUpdateCases: (cases: BailCase[]) => void;
  onBack: () => void;
}

export const PoliceDashboard: React.FC<Props> = ({ cases, onUpdateCases, onBack }) => {
  const [selectedCase, setSelectedCase] = useState<BailCase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Simulated station
  const station = "Kilimani Police Station";

  const filteredCases = cases.filter(c => 
    c.detaineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.obNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRelease = (id: string) => {
    const updated = cases.map(c => 
      c.id === id ? { ...c, status: CaseStatus.RELEASED } : c
    );
    onUpdateCases(updated);
    if (selectedCase?.id === id) setSelectedCase({ ...selectedCase, status: CaseStatus.RELEASED });
    alert('Release Authorized. Notification sent to detainee family.');
  };

  const handleAddNewCase = (newCase: BailCase) => {
    onUpdateCases([newCase, ...cases]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Top Header */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 shadow-lg z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">P</div>
          <h1 className="font-bold text-lg hidden sm:block">National Police Service - Justice Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-900/40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add New Case
          </button>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{station}</p>
            <p className="text-sm font-semibold">Insp. Ben Kimathi (OCS)</p>
          </div>
          <div className="w-10 h-10 bg-slate-700 rounded-full border border-slate-600"></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-4 space-y-2">
          <nav className="space-y-1">
            <button className="flex items-center w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Active Cases
            </button>
            <button className="flex items-center w-full px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Recent Releases
            </button>
            <button className="flex items-center w-full px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Audit Log
            </button>
          </nav>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-xl font-bold mt-4"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
             New Justice Case
          </button>

          <div className="mt-auto p-4 bg-slate-50 rounded-2xl">
            <p className="text-xs text-slate-500 mb-2 font-medium">STATION STATUS</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Paid & Pending Release</span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">{cases.filter(c => c.status === CaseStatus.PAID).length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* List View */}
          <div className={`flex-1 overflow-y-auto p-4 md:p-6 ${selectedCase ? 'hidden lg:block' : 'block'}`}>
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Case Management</h2>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search OB No. or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 w-full sm:w-64 outline-none"
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">OB Number</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Detainee</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredCases.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedCase(c)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{c.obNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                              {c.detaineeImage ? (
                                <img src={c.detaineeImage} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{c.detaineeName}</div>
                              <div className="text-xs text-slate-500 line-clamp-1">{c.offence}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${c.caseCategory === 'Fine' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {c.caseCategory || 'Bail'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900 font-mono">KES {c.bailAmount.toLocaleString()}</div>
                          <div className="text-xs text-emerald-600 font-medium">Raised: KES {c.amountRaised.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge status={c.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <button className="text-blue-600 hover:text-blue-800 font-bold">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Detail View Overlay/Side Panel */}
          {selectedCase && (
            <div className="flex-1 lg:max-w-md border-l border-slate-200 bg-white overflow-y-auto">
              <div className="p-6 space-y-8 pb-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Case Details</h3>
                  <button onClick={() => setSelectedCase(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Detainee Headshot in detail view */}
                <div className="w-full aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl">
                  {selectedCase.detaineeImage ? (
                    <img src={selectedCase.detaineeImage} alt={selectedCase.detaineeName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl">
                   <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedCase.caseCategory || 'Bail'} Reference</span>
                     <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded">{selectedCase.id}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Detainee</span>
                      <span className="text-sm font-bold">{selectedCase.detaineeName}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-sm text-slate-400">OB Number</span>
                      <span className="text-sm font-bold">{selectedCase.obNumber}</span>
                   </div>
                   <div className="pt-4 border-t border-slate-800">
                      <p className="text-xs text-slate-400 mb-1">OFFENCE</p>
                      <p className="text-sm font-medium">{selectedCase.offence}</p>
                   </div>
                   <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">TOTAL {selectedCase.caseCategory?.toUpperCase() || 'BAIL'}</p>
                        <p className="text-2xl font-bold font-mono">KES {selectedCase.bailAmount.toLocaleString()}</p>
                      </div>
                      <Badge status={selectedCase.status} />
                   </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Escrow Contributions</h4>
                  <div className="space-y-3">
                    {selectedCase.contributions.map(con => (
                      <div key={con.id} className="flex items-start gap-4 p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                          {con.contributorName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-bold">{con.contributorName}</p>
                            <p className="text-sm font-mono font-bold text-emerald-600">+ KES {con.amount}</p>
                          </div>
                          <p className="text-xs text-slate-400">M-Pesa Ref: {con.mpesaRef}</p>
                        </div>
                      </div>
                    ))}
                    {selectedCase.contributions.length === 0 && (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                         <p className="text-sm text-slate-400 italic">No contributions recorded yet.</p>
                         <p className="text-[10px] text-slate-400 mt-2">Public reference: {selectedCase.id}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedCase.status === CaseStatus.PAID && (
                  <div className="sticky bottom-0 bg-white pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => handleRelease(selectedCase.id)}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Authorize Final Release
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">This action will be logged in the immutable audit trail.</p>
                  </div>
                )}

                {selectedCase.status === CaseStatus.RELEASED && (
                  <div className="p-4 bg-slate-100 rounded-2xl text-center">
                    <p className="text-slate-600 font-bold uppercase text-sm">Case Cleared & Released</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <AddCaseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddNewCase}
        station={station}
      />
    </div>
  );
};

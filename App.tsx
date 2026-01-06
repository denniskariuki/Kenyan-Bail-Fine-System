
import React, { useState, useEffect } from 'react';
import { PoliceDashboard } from './components/police/PoliceDashboard';
import { UserApp } from './components/user/UserApp';
import { BailCase, User } from './types';
import { INITIAL_CASES } from './services/store';

type AppMode = 'LANDING' | 'POLICE' | 'USER';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('LANDING');
  const [cases, setCases] = useState<BailCase[]>(INITIAL_CASES);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Persistence simulation
  useEffect(() => {
    const saved = localStorage.getItem('bail_cases');
    if (saved) setCases(JSON.parse(saved));
  }, []);

  const updateCases = (newCases: BailCase[]) => {
    setCases(newCases);
    localStorage.setItem('bail_cases', JSON.stringify(newCases));
  };

  if (mode === 'LANDING') {
    return (
      <div className="min-h-screen flex flex-col items-center p-6 space-y-12 bg-slate-50">
        <div className="text-center space-y-6 pt-12">
          <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
             <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">BailAid Kenya</h1>
            <p className="text-xl text-slate-500 max-w-lg mx-auto leading-relaxed">Securing justice through community-powered bail support.</p>
          </div>
        </div>

        <div className="w-full max-w-5xl space-y-10">
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] text-center">I am here to support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Family */}
              <button 
                onClick={() => setMode('USER')}
                className="group flex flex-col items-center p-10 bg-white border border-slate-200 rounded-[2rem] hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900">Family</h3>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">Pay or contribute for a relative or close friend.</p>
              </button>

              {/* NGO */}
              <button 
                onClick={() => setMode('USER')}
                className="group flex flex-col items-center p-10 bg-white border border-slate-200 rounded-[2rem] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900">NGO</h3>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">Official legal aid and non-profit bail interventions.</p>
              </button>

              {/* Well Wisher */}
              <button 
                onClick={() => setMode('USER')}
                className="group flex flex-col items-center p-10 bg-white border border-slate-200 rounded-[2rem] hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-100 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900">Well Wisher</h3>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">Help a stranger or support community justice causes.</p>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-10 text-center">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Government Access</h2>
            <button 
              onClick={() => setMode('POLICE')}
              className="w-full max-w-md mx-auto flex items-center justify-between p-6 bg-slate-900 text-white rounded-[1.5rem] hover:bg-slate-800 transition-all duration-300 shadow-xl group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold">Police Portal</h3>
                  <p className="text-slate-400 text-xs uppercase tracking-wider">Authorized Personnel Only</p>
                </div>
              </div>
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>

        <footer className="mt-auto text-slate-400 text-xs text-center py-8 space-y-1">
          <p>Compliant with Kenyan Law (Constitution 2010, Section 49)</p>
          <p>Powered by Escrow-Link Systems Kenya</p>
        </footer>
      </div>
    );
  }

  return mode === 'POLICE' 
    ? <PoliceDashboard cases={cases} onUpdateCases={updateCases} onBack={() => setMode('LANDING')} />
    : <UserApp cases={cases} onUpdateCases={updateCases} onBack={() => setMode('LANDING')} />;
};

export default App;

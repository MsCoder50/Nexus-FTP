import { useState, useEffect } from 'react';

function App() {
  const [credentials, setCredentials] = useState({ host: '', user: '', password: '' });
  const [hasCredentials, setHasCredentials] = useState(false);
  const [testing, setTesting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('ftp_credentials');
    if (saved) {
      setCredentials(JSON.parse(saved));
      setHasCredentials(true);
    }
  }, []);

  const handleCredentialChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const saveCredentials = async (e) => {
    e.preventDefault();
    setTesting(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('host', credentials.host);
      formData.append('user', credentials.user);
      formData.append('password', credentials.password);

      const res = await fetch('http://127.0.0.1:8080/test-ftp', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('ftp_credentials', JSON.stringify(credentials));
        setHasCredentials(true);
        setMessage('Connected successfully.');
      } else {
        setError(data.error || 'Failed to connect to FTP.');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    } finally {
      setTesting(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('host', credentials.host);
      formData.append('user', credentials.user);
      formData.append('password', credentials.password);

      const res = await fetch('http://127.0.0.1:8080/get-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('File uploaded successfully.');
        setFile(null);
      } else {
        setError(data.error || 'Upload failed.');
      }
    } catch (err) {
      setError('Upload error. Is the backend running?');
    } finally {
      setUploading(false);
    }
  };

  const clearCredentials = () => {
    localStorage.removeItem('ftp_credentials');
    setHasCredentials(false);
    setMessage('');
    setError('');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950 font-sans selection:bg-purple-500/30">
      {/* Animated Background Elements */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse mix-blend-screen"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse mix-blend-screen" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-[120px] animate-pulse mix-blend-screen" style={{ animationDelay: '4s' }}></div>

      <div className="relative w-full max-w-md backdrop-blur-2xl bg-white/[0.02] border border-white/[0.05] rounded-3xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] p-8 sm:p-10 z-10">
        
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 mb-5 shadow-inner">
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 mb-2 drop-shadow-sm tracking-tight">
            Nexus FTP
          </h1>
          <p className="text-slate-400/80 text-sm font-medium tracking-wide">Secure File Transfer Protocol</p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-200 bg-red-950/40 p-4 rounded-xl border border-red-900/50 backdrop-blur-md shadow-lg shadow-red-900/20 flex items-start gap-3 transition-all duration-300">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>{error}</p>
          </div>
        )}
        
        {message && (
          <div className="mb-6 text-sm text-emerald-200 bg-emerald-950/40 p-4 rounded-xl border border-emerald-900/50 backdrop-blur-md shadow-lg shadow-emerald-900/20 flex items-start gap-3 transition-all duration-300">
            <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>{message}</p>
          </div>
        )}

        {!hasCredentials ? (
          <form onSubmit={saveCredentials} className="space-y-5">
            <div className="space-y-1.5 group">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-purple-400 transition-colors">Server Host</label>
              <input
                type="text"
                name="host"
                value={credentials.host}
                onChange={handleCredentialChange}
                required
                className="w-full bg-slate-900/40 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all backdrop-blur-sm"
                placeholder="ftp.example.com"
              />
            </div>
            <div className="space-y-1.5 group">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-purple-400 transition-colors">Username</label>
              <input
                type="text"
                name="user"
                value={credentials.user}
                onChange={handleCredentialChange}
                required
                className="w-full bg-slate-900/40 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all backdrop-blur-sm"
                placeholder="admin"
              />
            </div>
            <div className="space-y-1.5 group">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-purple-400 transition-colors">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleCredentialChange}
                required
                className="w-full bg-slate-900/40 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all backdrop-blur-sm"
                placeholder="••••••••"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={testing}
                className="relative w-full overflow-hidden group bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_-5px_rgba(147,51,234,0.7)]"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {testing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : 'Connect & Save'}
                </span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Select File</label>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Connected</span>
              </div>
              
              <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700/50 rounded-2xl hover:border-purple-500/50 hover:bg-slate-800/30 transition-all duration-300 cursor-pointer group bg-slate-900/20">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <>
                      <svg className="w-10 h-10 mb-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <p className="mb-1 text-sm font-semibold text-slate-200">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-10 h-10 mb-3 text-slate-500 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className="mb-1 text-sm text-slate-400 group-hover:text-slate-300 transition-colors"><span className="font-semibold text-purple-400">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-slate-500">Any file up to 1GB</p>
                    </>
                  )}
                </div>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={clearCredentials}
                className="px-5 py-3.5 rounded-xl border border-slate-700/50 bg-slate-900/40 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all focus:outline-none focus:ring-4 focus:ring-slate-800"
              >
                Disconnect
              </button>
              <button
                type="submit"
                disabled={uploading || !file}
                className="flex-1 relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.7)]"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : 'Upload File'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;

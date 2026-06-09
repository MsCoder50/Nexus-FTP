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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-50 font-sans selection:bg-rose-200">
      <div className="relative w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-sm p-8 sm:p-10 z-10">
        
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 mb-4 border border-blue-100">
            <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">
            Nexus FTP
          </h1>
          <p className="text-slate-500 text-sm font-medium">Secure File Transfer Protocol</p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3 transition-all duration-300">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>{error}</p>
          </div>
        )}
        
        {message && (
          <div className="mb-6 text-sm text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3 transition-all duration-300">
            <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>{message}</p>
          </div>
        )}

        {!hasCredentials ? (
          <form onSubmit={saveCredentials} className="space-y-4">
            <div className="space-y-1.5 group">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-blue-500 transition-colors">Server Host</label>
              <input
                type="text"
                name="host"
                value={credentials.host}
                onChange={handleCredentialChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all"
                placeholder="ftp.example.com"
              />
            </div>
            <div className="space-y-1.5 group">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-blue-500 transition-colors">Username</label>
              <input
                type="text"
                name="user"
                value={credentials.user}
                onChange={handleCredentialChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all"
                placeholder="admin"
              />
            </div>
            <div className="space-y-1.5 group">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-blue-500 transition-colors">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleCredentialChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={testing}
                className="w-full bg-rose-500 text-white font-semibold py-3.5 rounded-xl hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
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
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Select File</label>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Connected</span>
              </div>
              
              <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group bg-slate-50/50">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <>
                      <svg className="w-10 h-10 mb-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <p className="mb-1 text-sm font-semibold text-slate-700">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-10 h-10 mb-3 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className="mb-1 text-sm text-slate-500 group-hover:text-slate-600 transition-colors"><span className="font-semibold text-blue-500">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-slate-400">Any file up to 1GB</p>
                    </>
                  )}
                </div>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={clearCredentials}
                className="px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-slate-100"
              >
                Disconnect
              </button>
              <button
                type="submit"
                disabled={uploading || !file}
                className="flex-1 bg-rose-500 text-white font-semibold py-3.5 rounded-xl hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
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

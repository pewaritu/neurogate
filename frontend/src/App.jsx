import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'app'
  const [prompt, setPrompt] = useState("");
  const [txId, setTxId] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // --- LOGIC SECTION ---
  const handlePay = () => {
      alert("Please send 1000 QUBIC to: \n\nYOUR_WALLET_ADDRESS\n\nThen paste the Transaction ID below.");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        const res = await axios.post('http://localhost:3001/api/prompt', {
            txId: txId,
            prompt: prompt
        });

        if (res.data.success) {
            setResponse(res.data.reply);
        } else {
            alert("Payment verification failed.");
        }
    } catch (err) {
        alert("Error connecting to NeuroGate Node.");
    }
    setLoading(false);
  };

  // --- VIEW: LANDING PAGE ---
  if (view === 'landing') {
    return (
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        height: '100vh', background: 'radial-gradient(circle, #1a1a1a 0%, #000000 100%)', textAlign: 'center' 
      }} className="fade-in">
        
        <h1 style={{ fontSize: '4rem', marginBottom: '10px', color: '#00ffcc' }} className="glow-text">
          NEUROGATE
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px', margin: '0 auto' }}>
          The First <span style={{color: 'white'}}>Zero-Fee</span> AI Payment Rail on Qubic.
        </p>
        
        <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
          <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '10px', width: '200px' }}>
            <h3>⚡ Instant</h3>
            <p style={{fontSize: '0.8rem', color: '#666'}}>Powered by Qubic Ticks</p>
          </div>
          <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '10px', width: '200px' }}>
            <h3>💸 No Gas</h3>
            <p style={{fontSize: '0.8rem', color: '#666'}}>100% Value Transfer</p>
          </div>
          <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '10px', width: '200px' }}>
            <h3>🤖 AI Agents</h3>
            <p style={{fontSize: '0.8rem', color: '#666'}}>Unlock LLMs Instantly</p>
          </div>
        </div>

        <button 
          onClick={() => setView('app')}
          style={{ 
            marginTop: '60px', padding: '15px 50px', fontSize: '1.2rem', 
            background: 'transparent', border: '2px solid #00ffcc', color: '#00ffcc', 
            cursor: 'pointer', borderRadius: '5px' 
          }}
        >
          ENTER SYSTEM_
        </button>
      </div>
    );
  }

  // --- VIEW: APPLICATION ---
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', padding: '50px', maxWidth: '800px', margin: '0 auto' }} className="fade-in">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
        <h2 style={{ color: '#00ffcc' }}>⚡ NeuroGate Terminal</h2>
        <button onClick={() => setView('landing')} style={{background: 'none', border: 'none', color: '#555', cursor: 'pointer'}}>Back to Home</button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{color: '#888', display: 'block', marginBottom: '10px'}}>1. INPUT PROMPT</label>
        <textarea 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Ask the Oracle..."
          style={{ width: '100%', height: '100px', background: '#111', color: 'white', border: '1px solid #333', padding: '15px', borderRadius: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
        <div style={{flex: 1}}>
            <label style={{color: '#888', display: 'block', marginBottom: '10px'}}>2. PAYMENT</label>
            <button onClick={handlePay} style={{ width: '100%', padding: '12px', background: '#222', color: 'white', border: '1px solid #444', cursor: 'pointer', borderRadius: '5px' }}>
            Generate QR
            </button>
        </div>
        <div style={{flex: 2}}>
            <label style={{color: '#888', display: 'block', marginBottom: '10px'}}>3. VERIFICATION</label>
            <div style={{display: 'flex', gap: '10px'}}>
                <input 
                    type="text" 
                    placeholder="TX Hash (Enter DEMO_BYPASS)" 
                    value={txId}
                    onChange={e => setTxId(e.target.value)}
                    style={{ flex: 1, padding: '12px', background: '#111', color: 'white', border: '1px solid #333', borderRadius: '5px' }}
                />
                <button onClick={handleSubmit} disabled={loading} style={{ padding: '0 30px', background: loading ? '#555' : '#00ffcc', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                    {loading ? "..." : "EXECUTE"}
                </button>
            </div>
        </div>
      </div>

      {response && (
          <div style={{ marginTop: '40px', padding: '25px', borderLeft: '4px solid #00ffcc', background: '#111' }}>
              <h3 style={{marginTop: 0, color: '#00ffcc'}}>>> RESPONSE_DECRYPTED</h3>
              <p style={{lineHeight: '1.6'}}>{response}</p>
          </div>
      )}
    </div>
  );
}

export default App;

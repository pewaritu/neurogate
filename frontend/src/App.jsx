import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Add dark mode CSS here

function App() {
  const [prompt, setPrompt] = useState("");
  const [txId, setTxId] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Generate Payment Request
  const handlePay = () => {
      // In a real app, this integrates with Qubic Wallet directly.
      // For the Hackathon MVP, we show the QR/Address and ask user to paste TX ID.
      alert("Please send 1000 QUBIC to: \n\nYOUR_WALLET_ADDRESS\n\nThen paste the Transaction ID below.");
  };

  // 2. Submit Prompt & Proof of Payment
  const handleSubmit = async () => {
    setLoading(true);
    try {
        // Call our Middleware
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

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#00ffcc', minHeight: '100vh', padding: '50px', fontFamily: 'monospace' }}>
      <h1>⚡ NeuroGate | Qubic AI Rail</h1>
      <p>Decentralized AI access. Zero Fees. Instant Finality.</p>

      <div style={{ marginTop: '30px' }}>
        <h3>1. Ask the Oracle</h3>
        <textarea 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="What is the future of Qubic?"
          style={{ width: '100%', height: '100px', background: '#222', color: 'white', border: '1px solid #00ffcc' }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>2. Pay 1000 QUBICs</h3>
        <button onClick={handlePay} style={{ padding: '10px 20px', background: '#00ffcc', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          GET PAYMENT ADDRESS
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>3. Verify & Unlock</h3>
        <input 
            type="text" 
            placeholder="Paste Transaction ID (TX Hash)" 
            value={txId}
            onChange={e => setTxId(e.target.value)}
            style={{ width: '100%', padding: '10px', background: '#222', color: 'white', border: '1px solid #333' }}
        />
        <br/><br/>
        <button onClick={handleSubmit} disabled={loading} style={{ padding: '10px 40px', background: loading ? '#555' : '#00ffcc', color: 'black', fontWeight: 'bold' }}>
            {loading ? "VERIFYING ON QUBIC..." : "EXECUTE"}
        </button>
      </div>

      {response && (
          <div style={{ marginTop: '40px', padding: '20px', border: '1px dashed #00ffcc' }}>
              <h3>>> RESPONSE DECRYPTED:</h3>
              <p>{response}</p>
          </div>
      )}
    </div>
  );
}

export default App;

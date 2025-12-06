require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURATION
const MY_QUBIC_WALLET = "YOUR_QUBIC_WALLET_ADDRESS_HERE"; 
// ^ Use a real address you generate on the Testnet/Mainnet
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Put in .env file

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// MOCK DATABASE (In production, use Redis/Mongo)
// Stores transaction IDs we have already processed
let processedTxs = new Set();

// 1. Endpoint: Check for Payment & Get AI Response
app.post('/api/prompt', async (req, res) => {
    const { txId, prompt } = req.body;

    if (!txId || !prompt) return res.status(400).send("Missing Data");
    if (processedTxs.has(txId)) return res.status(400).send("Transaction already used");

    try {
        console.log(`Verifying Transaction: ${txId}...`);

        // REAL QUBIC VERIFICATION (Using Public API)
        // Note: For Hackathon, you might use the Testnet Explorer API
        const qubicRes = await axios.get(`https://api.qubic.org/v1/tx/${txId}`);
        
        // CHECK: Does the TX exist? Is it to OUR wallet? Is the amount correct?
        const txData = qubicRes.data;
        
        if (txData && txData.destId === MY_QUBIC_WALLET && txData.amount >= 1000) {
            
            // Mark as processed so they can't reuse the TX
            processedTxs.add(txId);

            // CALL AI
            console.log("Payment Confirmed! Generating AI response...");
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
            });

            const aiReply = completion.choices[0].message.content;

            // BONUS: TRIGGER EASYCONNECT (For Track 2 points)
            // Send a webhook to a Zapier/Make URL that posts to Discord
            try {
               await axios.post('https://hook.eu1.make.com/cwmoaxastwqpinep6pg5abu9mddvxvhv
', {
                   event: "AI_PAID",
                   amount: txData.amount,
                   prompt_snippet: prompt.substring(0, 20)
               });
            } catch (e) { console.log("Webhook failed, ignoring..."); }

            return res.json({ success: true, reply: aiReply });

        } else {
            return res.status(402).json({ success: false, message: "Payment not found or insufficient." });
        }

    } catch (error) {
        // FOR HACKATHON DEMO ONLY: 
        // If API is down/slow, allow a "Backdoor" for the video demo
        if (txId === "DEMO_BYPASS") {
             return res.json({ success: true, reply: "This is a simulated AI response triggered by Qubic payment." });
        }
        console.error(error);
        return res.status(500).send("Verification Error");
    }
});

app.listen(3001, () => console.log('NeuroGate Middleware running on port 3001'));

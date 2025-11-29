import express from "express";
import admin from "firebase-admin";
import serverless from "serverless-http";

const app = express();
app.use(express.json());

// --- Firebase Admin init ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

// ===================================================
// 1. NOTIF WARNING SUHU
// ===================================================
app.post("/notify-warning-temp", async (req, res) => {
  const { token, tempValue, doValue, freq } = req.body;

  try {
    const message = {
      token,
      notification: {
        title: `Peringatan Suhu Air !`,
        body: `Suhu air : ${tempValue}°C\nKadar DO : ${doValue} mg/l\nFrekuensi Aerator : ${freq} HZ\nMohon segera cek kondisi kolam.`,
      },
    };

    const id = await admin.messaging().send(message);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================================================
// 2. NOTIF WARNING DO
// ===================================================
app.post("/notify-warning-do", async (req, res) => {
  const { token, tempValue, doValue, freq } = req.body;

  try {
    const message = {
      token,
      notification: {
        title: `Peringatan Kadar Dissolved Oxygen !`,
        body: `Kadar DO : ${doValue} mg/l\nSuhu air : ${tempValue}°C\nFrekuensi Aerator : ${freq} HZ\nMohon segera cek kondisi kolam.`,
      },
    };

    const id = await admin.messaging().send(message);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================================================
// 3. FEEDING BERHASIL
// ===================================================
app.post("/notify-feeding-success", async (req, res) => {
  const { token, berat } = req.body;

  try {
    const message = {
      token,
      notification: {
        title: "Pemberian Pakan Berhasil",
        body: `Pakan berhasil diberikan sebanyak ${berat} gram.`,
      },
    };

    const id = await admin.messaging().send(message);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================================================
// 4. FEEDING GAGAL
// ===================================================
app.post("/notify-feeding-fail", async (req, res) => {
  const { token } = req.body;

  try {
    const message = {
      token,
      notification: {
        title: "Pemberian Pakan Gagal",
        body: "Gagal memberikan pakan: Pakan Habis",
      },
    };

    const id = await admin.messaging().send(message);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================================================
// 5. PAKAN HABIS
// ===================================================
app.post("/notify-feed-empty", async (req, res) => {
  const { token } = req.body;

  try {
    const message = {
      token,
      notification: {
        title: "Pakan Hampir Habis!",
        body: "Level pakan sangat rendah. Harap isi ulang wadah pakan.",
      },
    };

    const id = await admin.messaging().send(message);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROOT
app.get("/", (req, res) => {
  res.send("Backend Notifikasi Firebase berjalan di Vercel ✔");
});

// === INI PALING PENTING ===
export default serverless(app);


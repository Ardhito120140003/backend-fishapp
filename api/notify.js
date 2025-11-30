const admin = require("firebase-admin");

// --------------------------
// Firebase Admin Initialization
// --------------------------
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// --------------------------
// Vercel API Handler
// --------------------------
module.exports = async function handler(req, res) {
  const { method, url, body } = req;

  // Normalisasi URL (hapus query string)
  const cleanUrl = url.split("?")[0];

  // Root test
  if (cleanUrl === "/api/notify" && method === "GET") {
    return res.status(200).send("Backend Notifikasi Firebase berjalan di Vercel ✔");
  }

  // ===========================
  // WARNING TEMP
  // ===========================
  if (cleanUrl === "/api/notify-warning-temp" && method === "POST") {
    const { token, tempValue, doValue, freq } = body;

    try {
      const id = await admin.messaging().send({
        token,
        notification: {
          title: "Peringatan Suhu Air!",
          body: `Suhu: ${tempValue}°C\nDO: ${doValue} mg/l\nFrekuensi: ${freq} Hz`
        }
      });
      return res.status(200).json({ success: true, id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===========================
  // WARNING DO
  // ===========================
  if (cleanUrl === "/api/notify-warning-do" && method === "POST") {
    const { token, tempValue, doValue, freq } = body;

    try {
      const id = await admin.messaging().send({
        token,
        notification: {
          title: "Peringatan DO Rendah!",
          body: `DO: ${doValue} mg/l\nSuhu: ${tempValue}°C\nFrekuensi: ${freq} Hz`
        }
      });
      return res.status(200).json({ success: true, id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===========================
  // FEEDING SUCCESS
  // ===========================
  if (cleanUrl === "/api/notify-feeding-success" && method === "POST") {
    const { token, berat } = body;

    try {
      const id = await admin.messaging().send({
        token,
        notification: {
          title: "Pemberian Pakan Berhasil",
          body: `Pakan diberikan ${berat} gram`
        }
      });
      return res.status(200).json({ success: true, id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===========================
  // FEEDING FAIL
  // ===========================
  if (cleanUrl === "/api/notify-feeding-fail" && method === "POST") {
    const { token } = body;

    try {
      const id = await admin.messaging().send({
        token,
        notification: {
          title: "Pemberian Pakan Gagal",
          body: "Pakan habis!"
        }
      });
      return res.status(200).json({ success: true, id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===========================
  // FEED EMPTY
  // ===========================
  if (cleanUrl === "/api/notify-feed-empty" && method === "POST") {
    const { token } = body;

    try {
      const id = await admin.messaging().send({
        token,
        notification: {
          title: "Pakan Hampir Habis!",
          body: "Harap isi ulang pakan segera"
        }
      });
      return res.status(200).json({ success: true, id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 404 fallback
  return res.status(404).json({ error: "Not Found" });
};

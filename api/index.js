const admin = require("firebase-admin");

// --------------------------
// Firebase Admin Initialization
// --------------------------
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

// --------------------------
// EXPORT FUNCTION (COMMONJS) — WAJIB UNTUK VERCEL
// --------------------------
module.exports = async (req, res) => {
  const { method, url, body } = req;

  // Root route
  if (url === "/" && method === "GET") {
    return res.status(200).send("Backend Notifikasi Firebase berjalan di Vercel ✔");
  }

  // WARNING TEMP
  if (url === "/notify-warning-temp" && method === "POST") {
    const { token, tempValue, doValue, freq } = body;

    try {
      const id = await admin.messaging().send({
        token,
        notification: {
          title: "Peringatan Suhu Air!",
          body: `Suhu air: ${tempValue}°C\nDO: ${doValue} mg/l\nFrekuensi: ${freq} Hz`
        }
      });
      return res.status(200).json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // WARNING DO
  if (url === "/notify-warning-do" && method === "POST") {
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
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // FEEDING SUCCESS
  if (url === "/notify-feeding-success" && method === "POST") {
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
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // FEEDING FAIL
  if (url === "/notify-feeding-fail" && method === "POST") {
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
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // FEED EMPTY
  if (url === "/notify-feed-empty" && method === "POST") {
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
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(404).json({ error: "Not Found" });
};

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  });
}

export default async function handler(req, res) {
  const { method, url, body } = req;

  // === ROOT ===
  if (url === "/" && method === "GET") {
    return res.status(200).send("Backend Notifikasi Firebase berjalan di Vercel ✔");
  }

  // === 1. WARNING TEMP ===
  if (url === "/notify-warning-temp" && method === "POST") {
    try {
      const { token, tempValue, doValue, freq } = body;

      const message = {
        token,
        notification: {
          title: `Peringatan Suhu Air !`,
          body: `Suhu air : ${tempValue}°C\nKadar DO : ${doValue} mg/l\nFrekuensi Aerator : ${freq} HZ\nMohon segera cek kondisi kolam.`,
        },
      };

      const id = await admin.messaging().send(message);
      return res.status(200).json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // === 2. WARNING DO ===
  if (url === "/notify-warning-do" && method === "POST") {
    try {
      const { token, tempValue, doValue, freq } = body;

      const message = {
        token,
        notification: {
          title: `Peringatan Kadar Dissolved Oxygen !`,
          body: `Kadar DO : ${doValue} mg/l\nSuhu air : ${tempValue}°C\nFrekuensi Aerator : ${freq} HZ\nMohon segera cek kondisi kolam.`,
        },
      };

      const id = await admin.messaging().send(message);
      return res.status(200).json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // === 3. FEEDING SUCCESS ===
  if (url === "/notify-feeding-success" && method === "POST") {
    try {
      const { token, berat } = body;

      const message = {
        token,
        notification: {
          title: "Pemberian Pakan Berhasil",
          body: `Pakan berhasil diberikan sebanyak ${berat} gram.`,
        },
      };

      const id = await admin.messaging().send(message);
      return res.status(200).json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // === 4. FEEDING FAIL ===
  if (url === "/notify-feeding-fail" && method === "POST") {
    try {
      const { token } = body;

      const message = {
        token,
        notification: {
          title: "Pemberian Pakan Gagal",
          body: "Gagal memberikan pakan: Pakan Habis",
        },
      };

      const id = await admin.messaging().send(message);
      return res.status(200).json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // === 5. FEED EMPTY ===
  if (url === "/notify-feed-empty" && method === "POST") {
    try {
      const { token } = body;

      const message = {
        token,
        notification: {
          title: "Pakan Hampir Habis!",
          body: "Level pakan sangat rendah. Harap isi ulang wadah pakan.",
        },
      };

      const id = await admin.messaging().send(message);
      return res.status(200).json({ success: true, id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // === Not Found ===
  res.status(404).json({ error: "Endpoint not found" });
}

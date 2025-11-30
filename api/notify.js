import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export default async function handler(req, res) {
  const { method, url, body } = req;

  if (method === "GET") {
    return res.status(200).send("Backend Notifikasi Firebase berjalan di Vercel ✔");
  }

  if (req.url === "/api/notify-warning-temp" && method === "POST") {
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
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(404).json({ error: "Not Found" });
}

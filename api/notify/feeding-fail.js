const admin = require("firebase-admin");

// Firebase init
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
    }),
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { token } = req.body;

  try {
    const id = await admin.messaging().send({
      token,
      notification: {
        title: "Pemberian Pakan Gagal",
        body: "Pakan habis!"
      }
    });

    res.status(200).json({ success: true, id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

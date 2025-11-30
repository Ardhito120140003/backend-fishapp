module.exports = (req, res) => {
  res.status(200).json({
    message: "Notify API Active",
    endpoints: [
      "/api/notify/warning-temp",
      "/api/notify/warning-do",
      "/api/notify/feeding-success",
      "/api/notify/feeding-fail",
      "/api/notify/feed-empty"
    ]
  });
};

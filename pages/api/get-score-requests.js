// pages/api/get-score-requests.js

export default async function handler(req, res) {
  // This is a simple API key check - in production, use a more secure method
  const apiKey = req.headers["x-api-key"];

  console.log("Received API key:", apiKey);
  console.log("Expected API key:", process.env.ADMIN_API_KEY);

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Import the database client correctly
    console.log("Importing Replit database client...");
    // Instead of importing { Client }, import the default export
    const Database = await import("@replit/database");
    console.log("Creating database client...");
    // Use the default export directly
    const client = new Database.default();
    console.log("Database client created successfully");

    // Get the list of all submission IDs
    console.log("Fetching submission IDs...");
    const submissionIds = (await client.get("score_requests_list")) || [];
    console.log("Submission IDs:", submissionIds);

    // If there are no submissions, return an empty array
    if (submissionIds.length === 0) {
      return res.status(200).json([]);
    }

    // Get all submissions data
    const submissions = [];

    for (const id of submissionIds) {
      const data = await client.get(id);
      if (data) {
        submissions.push({
          id,
          ...data,
        });
      }
    }

    // Sort by creation date, newest first
    submissions.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json(submissions);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
}

// pages/api/get-score-requests.js

export default async function handler(req, res) {
  const apiKey = req.headers["x-api-key"];

  console.log("Received API key:", apiKey);
  console.log("Expected API key:", process.env.ADMIN_API_KEY);

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log("Importing Replit database client...");
    const Database = await import("@replit/database");
    console.log("Creating database client...");
    const client = new Database.default();
    console.log("Database client created successfully");

    console.log("Fetching submission IDs...");
    let submissionIds;
    try {
      submissionIds = await client.get("score_requests_list");
      console.log("Submission IDs:", submissionIds);
    } catch (e) {
      console.log("Error fetching submission IDs:", e);
      submissionIds = [];
    }

    // Check if submissionIds is a valid array
    if (
      !submissionIds ||
      !Array.isArray(submissionIds) ||
      submissionIds.ok === false
    ) {
      console.log("No valid submissions found, returning empty array");
      return res.status(200).json([]);
    }

    console.log("Found valid submission IDs, fetching details...");
    const submissions = [];

    for (const id of submissionIds) {
      try {
        const data = await client.get(id);
        if (data && data.ok !== false) {
          submissions.push({
            id,
            ...data,
          });
        }
      } catch (error) {
        console.error(`Error fetching submission ${id}:`, error);
      }
    }

    // Sort by creation date, newest first
    submissions.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    console.log(`Returning ${submissions.length} submissions`);
    return res.status(200).json(submissions);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
}

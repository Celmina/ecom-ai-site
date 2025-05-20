// pages/api/submit-score-request.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url, email, name } = req.body;

  // Validate data
  if (!url || !email || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Import the database client dynamically to avoid the constructor error
    const { Client } = await import("@replit/database");
    const client = new Client();

    // Create a unique ID for this submission
    const submissionId = `score_request_${Date.now()}`;

    // Store the submission
    await client.set(submissionId, {
      url,
      email,
      name,
      createdAt: new Date().toISOString(),
      status: "pending", // For tracking assessment status
    });

    // Optionally, also store a list of all submissions for easy retrieval
    // First, get the current list (or create an empty array if it doesn't exist)
    let submissionsList = (await client.get("score_requests_list")) || [];

    // Add the new submission ID to the list
    submissionsList.push(submissionId);

    // Save the updated list
    await client.set("score_requests_list", submissionsList);

    return res.status(200).json({ message: "Request received" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
}

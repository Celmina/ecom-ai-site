// pages/api/submit-score-request.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url, email, name } = req.body;
  console.log("Received form data:", { url, email, name });

  // Validate data
  if (!url || !email || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Import the database client correctly
    console.log("Importing Replit database client...");
    const Database = await import("@replit/database");
    console.log("Creating database client...");
    const client = new Database.default();
    console.log("Database client created successfully");

    // Create a unique ID for this submission
    const submissionId = `score_request_${Date.now()}`;
    console.log("Created submission ID:", submissionId);

    // Store the submission
    const submissionData = {
      url,
      email,
      name,
      createdAt: new Date().toISOString(),
      status: "pending", // For tracking assessment status
    };

    console.log("Storing submission data:", submissionData);
    await client.set(submissionId, submissionData);
    console.log("Submission data stored successfully");

    // Optionally, also store a list of all submissions for easy retrieval
    // First, get the current list (or create an empty array if it doesn't exist)
    console.log("Fetching existing submissions list...");
    let submissionsList = (await client.get("score_requests_list")) || [];
    console.log("Current submissions list:", submissionsList);

    // Add the new submission ID to the list
    submissionsList.push(submissionId);
    console.log("Updated submissions list:", submissionsList);

    // Save the updated list
    console.log("Storing updated submissions list...");
    await client.set("score_requests_list", submissionsList);
    console.log("Submissions list updated successfully");

    return res.status(200).json({ message: "Request received" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
}
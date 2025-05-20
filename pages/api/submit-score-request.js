// pages/api/submit-score-request.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("Submit request received", req.method);
  console.log("Request body:", req.body);

  const { url, email, name } = req.body;
  console.log("Extracted form data:", { url, email, name });

  // Validate data
  if (!url || !email || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
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
      status: "pending",
    };

    console.log("Storing submission data:", submissionData);
    await client.set(submissionId, submissionData);
    console.log("Submission data stored successfully");

    // Get all current submission IDs
    let submissionsList = [];

    try {
      // Try to get the existing list
      const currentList = await client.get("score_requests_list");
      console.log("Current submissions list from DB:", currentList);

      // Check different possible formats
      if (currentList && currentList.ok === true && Array.isArray(currentList.value)) {
        submissionsList = currentList.value;
      } else if (Array.isArray(currentList)) {
        submissionsList = currentList;
      } else {
        // If not found or not an array, create a new empty array
        submissionsList = [];
      }
    } catch (e) {
      console.log("Error fetching submissions list:", e);
      console.log("Initializing new submissions list");
      submissionsList = [];
    }

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
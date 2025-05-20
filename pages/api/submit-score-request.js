// pages/api/submit-score-request.js

  // pages/api/submit-score-request.js
  // Add more debug logs

  export default async function handler(req, res) {
    console.log("Submit request received", req.method);
    console.log("Request body:", req.body);

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { url, email, name } = req.body;
    console.log("Extracted form data:", { url, email, name });
  }

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

    // Get the current list or initialize it
    let submissionsList = [];
    try {
      const currentList = await client.get("score_requests_list");
      if (currentList && Array.isArray(currentList)) {
        submissionsList = currentList;
      }
    } catch (e) {
      console.log("Initializing new submissions list");
      // If there's an error or the list doesn't exist, start with an empty array
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

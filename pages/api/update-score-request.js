// pages/api/update-score-request.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Verify API key
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, status } = req.body;

  // Validate data
  if (!id || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate status
  const validStatuses = ["pending", "completed", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    console.log("Importing Replit database client...");
    const Database = await import("@replit/database");
    console.log("Creating database client...");
    const client = new Database.default();
    console.log("Database client created successfully");

    // Get the current data for this submission
    console.log(`Fetching submission with ID: ${id}`);
    const result = await client.get(id);

    let submissionData;

    // Check if the result is in { ok: true, value: {...} } format
    if (result && result.ok === true && result.value) {
      submissionData = result.value;
    }
    // Or if it's the data directly
    else if (result && typeof result === "object") {
      submissionData = result;
    } else {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Update the status
    console.log(`Updating status from ${submissionData.status} to ${status}`);
    submissionData.status = status;

    // Save the updated submission
    console.log("Saving updated submission data");
    await client.set(id, submissionData);
    console.log("Submission updated successfully");

    return res.status(200).json({
      message: "Status updated successfully",
      request: {
        id,
        ...submissionData,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
}

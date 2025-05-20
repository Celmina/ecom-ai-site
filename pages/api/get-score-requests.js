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
    let submissionIds = [];
    try {
      const result = await client.get("score_requests_list");
      console.log("Result from database:", result);

      // Check if the result is in { ok: true, value: [...] } format
      if (result && result.ok === true && Array.isArray(result.value)) {
        submissionIds = result.value;
        console.log("Found submission IDs in .value property:", submissionIds);
      } 
      // Or if it's a direct array
      else if (Array.isArray(result)) {
        submissionIds = result;
        console.log("Found submission IDs directly:", submissionIds);
      }
      // If it's an object with other properties that might contain our array
      else if (result && typeof result === 'object') {
        // Try to find an array property
        for (const key in result) {
          if (Array.isArray(result[key])) {
            submissionIds = result[key];
            console.log(`Found submission IDs in .${key} property:`, submissionIds);
            break;
          }
        }
      }
    } catch (e) {
      console.log("Error fetching submission IDs:", e);
    }

    // If no valid submission IDs were found
    if (!submissionIds || submissionIds.length === 0) {
      console.log("No valid submissions found, returning empty array");
      return res.status(200).json([]);
    }

    console.log("Found valid submission IDs:", submissionIds);
    console.log("Fetching details for each submission...");

    const submissions = [];

    for (const id of submissionIds) {
      try {
        const result = await client.get(id);
        console.log(`Fetched data for ${id}:`, result);

        // Check if the result is in { ok: true, value: {...} } format
        if (result && result.ok === true && result.value) {
          submissions.push({
            id,
            ...result.value,
          });
        } 
        // Or if it's the data directly
        else if (result && typeof result === 'object' && !result.ok) {
          submissions.push({
            id,
            ...result,
          });
        }
      } catch (error) {
        console.error(`Error fetching submission ${id}:`, error);
      }
    }

    console.log(`Successfully retrieved ${submissions.length} submissions`);

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
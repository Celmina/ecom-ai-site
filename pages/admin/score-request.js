// pages/admin/score-requests.js
import { useState, useEffect } from "react";
import { ArrowDownCircle } from "lucide-react";

export default function ScoreRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-score-requests", {
        headers: {
          "X-API-Key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      setRequests(data);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["ID", "URL", "Name", "Email", "Date", "Status"];
    const csvRows = [headers];

    requests.forEach((req) => {
      csvRows.push([
        req.id,
        req.url,
        req.name,
        req.email,
        formatDate(req.createdAt),
        req.status,
      ]);
    });

    // Convert to CSV string
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `score-requests-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    a.click();
  };

  return (
    <div className="admin-page">
      <div className="container max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-6">
          Score Requests Admin
        </h1>

        {!isAuthenticated ? (
          <div className="auth-container bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              Authentication Required
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Admin API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                  placeholder="Enter your API key"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                Access Dashboard
              </button>

              {error && <p className="text-red-400 mt-3">{error}</p>}
            </form>
          </div>
        ) : (
          <div className="requests-container">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">All Requests</h2>
              <button
                onClick={exportToCSV}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              >
                <ArrowDownCircle size={18} className="mr-2" /> Export CSV
              </button>
            </div>

            {loading ? (
              <p className="text-gray-400">Loading requests...</p>
            ) : requests.length === 0 ? (
              <p className="text-gray-400">No score requests found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800 text-gray-300 text-left">
                      <th className="p-3 border-b border-gray-700">URL</th>
                      <th className="p-3 border-b border-gray-700">Name</th>
                      <th className="p-3 border-b border-gray-700">Email</th>
                      <th className="p-3 border-b border-gray-700">Date</th>
                      <th className="p-3 border-b border-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr
                        key={req.id}
                        className="border-b border-gray-800 hover:bg-gray-900"
                      >
                        <td className="p-3 text-white">{req.url}</td>
                        <td className="p-3 text-white">{req.name}</td>
                        <td className="p-3 text-white">{req.email}</td>
                        <td className="p-3 text-gray-300">
                          {formatDate(req.createdAt)}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              req.status === "pending"
                                ? "bg-yellow-800 text-yellow-200"
                                : req.status === "completed"
                                  ? "bg-green-800 text-green-200"
                                  : "bg-gray-800 text-gray-200"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

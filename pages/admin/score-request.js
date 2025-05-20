// pages/admin/score-request.js
import { useState, useEffect } from "react";
import { ArrowDownCircle, RefreshCw, Edit2, Eye, Mail, ExternalLink, Search } from "lucide-react";
import Head from "next/head";

export default function ScoreRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewingRequest, setViewingRequest] = useState(null);

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
      setFilteredRequests(data);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      let result = [...requests];

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(req => 
          req.url.toLowerCase().includes(term) || 
          req.name.toLowerCase().includes(term) || 
          req.email.toLowerCase().includes(term)
        );
      }

      // Filter by status
      if (selectedStatus !== "all") {
        result = result.filter(req => req.status === selectedStatus);
      }

      setFilteredRequests(result);
    }
  }, [searchTerm, selectedStatus, requests, isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
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

  const updateRequestStatus = async (id, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch("/api/update-score-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          id,
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      // Update local state to reflect the change
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      ));

      setEditingId(null);
    } catch (err) {
      alert("Error updating status: " + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const refreshData = () => {
    fetchRequests();
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-800 text-yellow-200';
      case 'completed':
        return 'bg-green-800 text-green-200';
      case 'rejected':
        return 'bg-red-800 text-red-200';
      default:
        return 'bg-gray-800 text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Score Requests Admin | ecom.ai</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-6">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">ecom.ai</div>
            <div className="flex space-x-8">
              <a href="/" className="text-gray-300 hover:text-white">Features</a>
              <a href="/" className="text-gray-300 hover:text-white">Pricing</a>
              <a href="/" className="text-gray-300 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Authentication Required</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="apiKey">
                  Admin API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  placeholder="Enter your API key"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
              >
                Access Dashboard
              </button>

              {error && (
                <div className="p-4 rounded-lg bg-red-900 text-red-200 border border-red-800">
                  <p>{error}</p>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Dashboard Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold mb-3">Score Requests Admin</h1>
              <p className="text-gray-400 text-lg">Manage and track AEO score requests</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Total Requests Card */}
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h3 className="text-gray-400 text-lg mb-2">Total Requests</h3>
                <div className="text-3xl font-bold">{requests.length}</div>
              </div>

              {/* Pending Requests Card */}
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h3 className="text-gray-400 text-lg mb-2">Pending Requests</h3>
                <div className="text-3xl font-bold">{requests.filter(r => r.status === 'pending').length}</div>
              </div>

              {/* Completed Requests Card */}
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h3 className="text-gray-400 text-lg mb-2">Completed Requests</h3>
                <div className="text-3xl font-bold">{requests.filter(r => r.status === 'completed').length}</div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-semibold mb-4">Filters & Controls</h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by URL, name, or email..."
                    className="pl-10 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filters & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    className="p-3 bg-gray-700 text-white border border-gray-600 rounded-lg"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button
                    onClick={refreshData}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center"
                  >
                    <RefreshCw size={18} className="mr-2" /> Refresh
                  </button>

                  <button
                    onClick={exportToCSV}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center"
                  >
                    <ArrowDownCircle size={18} className="mr-2" /> Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 overflow-hidden">
              <h2 className="text-xl font-semibold p-6 border-b border-gray-700">All Requests</h2>

              {loading ? (
                <div className="p-10 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-gray-400">Loading requests...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-gray-400 mb-2">No score requests found.</p>
                  {searchTerm || selectedStatus !== 'all' ? (
                    <p className="text-sm text-gray-500">Try changing your search filters</p>
                  ) : null}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-700 text-left">
                        <th className="px-6 py-4 font-medium">URL</th>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredRequests.map((req) => (
                        <tr 
                          key={req.id} 
                          className="hover:bg-gray-750"
                        >
                          <td className="px-6 py-4">
                            <a 
                              href={req.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-400 hover:text-blue-300 flex items-center"
                            >
                              <span className="truncate max-w-[200px] block">{req.url}</span>
                              <ExternalLink size={14} className="ml-1 flex-shrink-0" />
                            </a>
                          </td>
                          <td className="px-6 py-4">{req.name}</td>
                          <td className="px-6 py-4">
                            <a 
                              href={`mailto:${req.email}`} 
                              className="text-blue-400 hover:text-blue-300 flex items-center"
                            >
                              {req.email}
                              <Mail size={14} className="ml-1 flex-shrink-0" />
                            </a>
                          </td>
                          <td className="px-6 py-4">{formatDate(req.createdAt)}</td>
                          <td className="px-6 py-4">
                            {editingId === req.id ? (
                              <select 
                                className="px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded"
                                defaultValue={req.status}
                                onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                                disabled={updatingStatus}
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            ) : (
                              <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusBadgeClass(req.status)}`}>
                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {editingId === req.id ? (
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-2 text-gray-400 hover:text-white rounded"
                                disabled={updatingStatus}
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingId(req.id)}
                                className="p-2 text-blue-400 hover:text-blue-300 rounded"
                                title="Edit Status"
                              >
                                <Edit2 size={16} /> Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 mt-20 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-gray-400">© 2025 ecom.ai. All rights reserved.</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
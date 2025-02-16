import React, { useState } from 'react';
import axios from 'axios';
import { Octokit } from "@octokit/core";
import './App.css'; // We'll create this next

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const triggerScan = async () => {
    if (!repoUrl) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    try {
      const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });
      await octokit.request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", {
        owner: "YOUR_GITHUB_USERNAME",
        repo: "ScanCore",
        workflow_id: "scan.yml",
        ref: "main",
        inputs: { repo_url: repoUrl },
      });

      // Poll for results (simplified example)
      setTimeout(() => {
        setResults({
          bandit: { issues: 3, results: "Sample Bandit results..." },
          trufflehog: { issues: 1, results: "Sample TruffleHog results..." }
        });
        setIsLoading(false);
      }, 5000); // Replace with real API calls to fetch artifacts

    } catch (err) {
      setError(`Error: ${err.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🔍 ScanCore</h1>
        <p>A GitHub-Powered Code Security Scanner</p>
      </header>

      <div className="scan-form">
        <input
          type="text"
          placeholder="Enter GitHub Repo URL (e.g., https://github.com/user/repo)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <button onClick={triggerScan} disabled={isLoading}>
          {isLoading ? "Scanning..." : "Start Scan"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {results && (
        <div className="results">
          <h2>Scan Results</h2>
          
          <div className="result-section">
            <h3>Security Issues (Bandit)</h3>
            <div className="issue-count">{results.bandit.issues} issues found</div>
            <pre>{results.bandit.results}</pre>
          </div>

          <div className="result-section">
            <h3>Secrets Found (TruffleHog)</h3>
            <div className="issue-count">{results.trufflehog.issues} secrets detected</div>
            <pre>{results.trufflehog.results}</pre>
          </div>
        </div>
      )}

      <footer>
        <p>Powered by GitHub Actions • 🛡️ Secure by Design</p>
      </footer>
    </div>
  );
}

export default App;
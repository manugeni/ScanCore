import React, { useState } from 'react';
import axios from 'axios';
import { Octokit } from "@octokit/core";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [results, setResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const triggerScan = async () => {
    setIsLoading(true);
    try {
      // Trigger GitHub Actions workflow
      const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });
      await octokit.request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", {
        owner: "YOUR_GITHUB_USERNAME",
        repo: "ScanCore",
        workflow_id: "scan.yml",
        ref: "main",
        inputs: { repo_url: repoUrl },
      });
      setResults("Scan triggered! Check GitHub Actions for results.");
    } catch (error) {
      setResults(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>ScanCore 🔍</h1>
      <input
        type="text"
        placeholder="Enter GitHub repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button onClick={triggerScan} disabled={isLoading}>
        {isLoading ? "Scanning..." : "Scan Repository"}
      </button>
      <pre>{results}</pre>
    </div>
  );
}

export default App;
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { uploadUrl } from "@/lib/mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/global/loader";
import { Navbar } from "@/components";
import ReactMarkdown from "react-markdown";

export default function UploadPage() {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/auth/sign-in");
    }
  }, [token, router]);

  const handleUpload = async () => {
    if (!repoUrl) {
      setError("Please enter a repository URL");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const result = await uploadUrl(repoUrl, token!);
      if (result.success) {
        setAnalysis(result.analysis);
        // Optionally redirect to dashboard to see the new activity
        router.push("/dashboard");
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during upload");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <Loader text="Redirecting to sign-in..." size={150} />;

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-4">Upload Repository</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {analysis && (
          <div className="mb-6 p-4 bg-gray-800 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
            <div className="text-gray-300 whitespace-pre-wrap">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}
        <div className="grid gap-4 max-w-md">
          <Label htmlFor="repo-url">Repository URL</Label>
          <Input
            id="repo-url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter repository URL (e.g., raw GitHub link)"
          />
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload and Analyze"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </>
  );
}

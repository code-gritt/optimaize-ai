"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/global/loader";
import { Navbar } from "@/components";

const GRAPHQL_API_URL = "https://optimaize-api.onrender.com/graphql";

export default function UploadPage() {
  const { user, token, clearAuth } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

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

    const mutation = `
      mutation CreateActivity($input: CreateActivityInput!) {
        createActivity(input: $input) {
          success
          activity {
            id
            activity_type
            details
            timestamp
          }
          error
        }
      }
    `;

    try {
      const variables = {
        input: {
          user_id: user!.id,
          activity_type: "upload_repo",
          details: repoUrl,
        },
      };
      const response = await fetch(GRAPHQL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      const data = result.data.createActivity;
      if (data.success) {
        alert("Upload successful!");
        setRepoUrl("");
      } else {
        setError(data.error || "Upload failed");
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
        <div className="grid gap-4 max-w-md">
          <Label htmlFor="repo-url">Repository URL</Label>
          <Input
            id="repo-url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter repository URL"
          />
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </>
  );
}

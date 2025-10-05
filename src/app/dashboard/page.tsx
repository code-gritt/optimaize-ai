"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { getMe } from "@/lib/mutation";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/loader";
import { Navbar } from "@/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define Activity interface
interface Activity {
  id: number;
  user_id: number;
  activity_type: string;
  details: string | null;
  timestamp: string;
}

const GRAPHQL_API_URL = "https://optimaize-api.onrender.com/graphql";

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loader text="Loading Dashboard" size={150} />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [editForm, setEditForm] = useState<Activity>({
    id: 0,
    user_id: 0,
    activity_type: "",
    details: "",
    timestamp: "",
  });
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tokenFromUrl = searchParams.get("token");

    const fetchUserAndActivities = async (authToken: string | null) => {
      try {
        if (!user?.id) throw new Error("User ID not available");
        const userData = await getMe(authToken!); // Non-null assertion since tokenFromUrl is validated
        setAuth(userData, authToken!);
        await fetchActivities(authToken);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to load dashboard");
        clearAuth();
        router.push("/auth/sign-in");
      } finally {
        setLoading(false);
      }
    };

    const fetchActivities = async (authToken: string | null) => {
      const query = `
        query {
          activities(userId: ${user!.id}) {
            id
            user_id
            activity_type
            details
            timestamp
          }
        }
      `;
      try {
        const data = await graphqlRequest<{ activities: Activity[] }>(
          query,
          undefined,
          authToken || undefined // Convert null to undefined for graphqlRequest
        );
        setActivities(data.activities || []);
      } catch (err: any) {
        console.error("Activity fetch error:", err);
        setError(err.message || "Failed to load activities");
      }
    };

    if (tokenFromUrl) {
      fetchUserAndActivities(tokenFromUrl);
      router.replace("/dashboard");
    } else if (token) {
      fetchUserAndActivities(token);
    } else {
      router.push("/auth/sign-in");
      setLoading(false);
    }
  }, [token, searchParams, router, setAuth, clearAuth, user?.id]);

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/sign-in");
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setEditForm({
      id: activity.id,
      user_id: activity.user_id,
      activity_type: activity.activity_type,
      details: activity.details || "",
      timestamp: activity.timestamp,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (activity: Activity) => {
    setSelectedActivity(activity);
    setDeleteDialogOpen(true);
  };

  const saveEdit = async () => {
    if (!selectedActivity) return;
    const mutation = `
      mutation UpdateActivity($input: UpdateActivityInput!) {
        updateActivity(input: $input) {
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
          id: selectedActivity.id,
          activity_type: editForm.activity_type,
          details: editForm.details,
        },
      };
      const data = await graphqlRequest<{
        updateActivity: {
          success: boolean;
          activity: Activity;
          error: string | null;
        };
      }>(mutation, variables, token || undefined); // Convert null to undefined
      if (data.updateActivity.success) {
        setActivities(
          activities.map((a) =>
            a.id === selectedActivity.id
              ? {
                  ...a,
                  activity_type: editForm.activity_type,
                  details: editForm.details,
                }
              : a
          )
        );
        setEditDialogOpen(false);
      } else {
        setError(data.updateActivity.error || "Edit failed");
      }
    } catch (err: any) {
      setError(err.message || "Edit failed");
    }
  };

  const confirmDelete = async () => {
    if (!selectedActivity) return;
    const mutation = `
      mutation DeleteActivity($id: Int!) {
        deleteActivity(id: $id) {
          success
          error
        }
      }
    `;
    try {
      const variables = { id: selectedActivity.id };
      const data = await graphqlRequest<{
        deleteActivity: { success: boolean; error: string | null };
      }>(mutation, variables, token || undefined); // Convert null to undefined
      if (data.deleteActivity.success) {
        setActivities(activities.filter((a) => a.id !== selectedActivity.id));
        setDeleteDialogOpen(false);
      } else {
        setError(data.deleteActivity.error || "Delete failed");
      }
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  const handleUpload = async () => {
    if (!repoUrl) return;
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
      const data = await graphqlRequest<{
        createActivity: {
          success: boolean;
          activity: Activity;
          error: string | null;
        };
      }>(mutation, variables, token || undefined); // Convert null to undefined
      if (data.createActivity.success) {
        setActivities([...activities, data.createActivity.activity]);
        setUploadDialogOpen(false);
        setRepoUrl("");
      } else {
        setError(data.createActivity.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message || "Upload failed");
    }
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-center">{error || "User not found."}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-4">
          Welcome, {user.email.split("@")[0]}!
        </h1>
        <p className="text-gray-500 mb-6">Credits: {user.credits}</p>
        <div className="mb-4 flex gap-2">
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Home
          </Button>
          <Button onClick={handleLogout} className="ml-2">
            Sign Out
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)}>Upload Repo</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User Avatar</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.id}</TableCell>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      {activity.user_id.toString().charAt(0).toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {activity.activity_type}: {activity.details || "No details"}
                  </TableCell>
                  <TableCell>
                    {new Date(activity.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(activity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(activity)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Activity</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity-type" className="text-right">
                  Activity Type
                </Label>
                <Input
                  id="activity-type"
                  value={editForm.activity_type}
                  onChange={(e) =>
                    setEditForm({ ...editForm, activity_type: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="details" className="text-right">
                  Details
                </Label>
                <Input
                  id="details"
                  value={editForm.details || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, details: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveEdit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this activity?</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Repository</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="repo-url" className="text-right">
                  Repo URL
                </Label>
                <Input
                  id="repo-url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="Enter repository URL"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </>
  );
}

// Generic GraphQL request function
async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>,
  token?: string // Updated to allow undefined explicitly
): Promise<T> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (!response.ok)
    throw new Error(result?.errors?.[0]?.message || "Network error");
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data as T;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { videoApi } from "@/lib/video";

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const videos = await videoApi.getAll();
setVideos(videos || []);
    } catch (error) {
      console.error("Failed to load videos", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Video Manager
        </h1>

        <button className="bg-black text-white px-4 py-2 rounded">
          + Add Video
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Vimeo ID</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {videos.map((video: any) => (
              <tr key={video.id}>
                <td className="p-3 border">
                  {video.title || "-"}
                </td>

                <td className="p-3 border">
                  {video.vimeoId}
                </td>

                <td className="p-3 border">
                  {video.category}
                </td>

                <td className="p-3 border">
                  {video.isActive
                    ? "Active"
                    : "Inactive"}
                </td>
                <td className="p-3 border">
  <div className="flex gap-2">
    <button
      className="px-3 py-1 bg-blue-600 text-white rounded"
    >
      Edit
    </button>

    <button
      className="px-3 py-1 bg-red-600 text-white rounded"
    >
      Delete
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
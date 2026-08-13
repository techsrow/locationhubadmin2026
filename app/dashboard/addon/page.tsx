"use client";

import GalleryManager from "@/app/components/GalleryManager";

export default function AddOnPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-8">
        Add On Services
      </h1>

      <GalleryManager
  endpoint="add-on-services"
  imageKey="imageUrl"
  orderKey="displayorder"
  showTitle={true}
  showPageUrl={true}
/>

    </div>
  );
}

"use client";

import GalleryManager from "@/app/components/GalleryManager";


export default function SliderPage() {
  return (
    <GalleryManager
      endpoint="slider"
      imageKey="imageUrl"
      orderKey="displayorder"
    />
  );
}

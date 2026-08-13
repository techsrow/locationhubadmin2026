import GalleryManager from "@/app/components/GalleryManager";

export default function GroomPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Groom Gallery</h1>
      <GalleryManager endpoint="groom" />
    </div>
  );
}

import CostumeGalleryManager from "@/app/components/CostumeGalleryManager";

export default function GroomPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Groom Gallery
      </h1>

      <CostumeGalleryManager
        endpoint="groom"
      />
    </div>
  );
}
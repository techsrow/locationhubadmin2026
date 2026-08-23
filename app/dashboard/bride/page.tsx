import CostumeGalleryManager from "@/app/components/CostumeGalleryManager";

export default function BridePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Bride Gallery
      </h1>

      <CostumeGalleryManager endpoint="bride" />
    </div>
  );
}
import GalleryManager from "@/app/components/GalleryManager";

export default function BridePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bride Gallery</h1>
      <GalleryManager endpoint="bride" />
    </div>
  );
}

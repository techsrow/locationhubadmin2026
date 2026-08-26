import SeoForm from "@/app/components/SeoForm";
import { getSeoPage } from "@/services/seoService";

export default async function EditSeoPage({
  params,
}: {
  params: Promise<{
    pageKey: string;
  }>;
}) {
  const { pageKey } =
    await params;

  const seo =
    await getSeoPage(pageKey);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Edit SEO
      </h1>

      <SeoForm
        initialData={seo.data}
        isEdit
      />
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SeoForm from "@/app/components/SeoForm";
import { getSeoPage } from "@/services/seoService";

export default function EditSeoPage() {
  const { pageKey } = useParams();

  const [seo, setSeo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeo = async () => {
      try {
        const response = await getSeoPage(
          pageKey as string
        );

        setSeo(response.data);
      } catch (error) {
        console.error("Failed to load SEO:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pageKey) {
      loadSeo();
    }
  }, [pageKey]);

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!seo) {
    return (
      <div className="p-6">
        SEO page not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        Edit SEO
      </h1>

      <SeoForm
        initialData={seo}
        isEdit={true}
      />
    </div>
  );
}
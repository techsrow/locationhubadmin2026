import Link from "next/link";

export default function SeoPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          SEO Pages
        </h1>

        <Link
          href="/dashboard/seo/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add SEO
        </Link>
      </div>

      {/* table comes here */}
    </div>
  );
}
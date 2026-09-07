/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { faqApi } from "@/services/faq";

export default function EditFaqPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const faq = await faqApi.getById(id);

      setQuestion(faq.question || "");
      setAnswer(faq.answer || "");
      setIsActive(faq.isActive);
    } catch (error) {
      console.error(error);
      alert("Failed to load FAQ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      await faqApi.update(id, {
        question,
        answer,
        isActive,
      });

      router.push("/dashboard/faq");
    } catch (error) {
      console.error(error);
      alert("Failed to update FAQ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading FAQ...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        Edit FAQ
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="block mb-2 font-medium">
            Question
          </label>

          <input
            type="text"
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            className="w-full border rounded p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Answer
          </label>

          <textarea
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            rows={6}
            className="w-full border rounded p-3"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
          />

          <span>Active</span>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-5 py-3 rounded"
        >
          {saving
            ? "Updating..."
            : "Update FAQ"}
        </button>
      </form>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { faqApi } from "@/services/faq";

export default function CreateFaqPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await faqApi.create({
        question,
        answer,
        isActive,
      });

      router.push("/dashboard/faq");
    } catch (error) {
      console.error(error);
      alert("Failed to create FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        Create FAQ
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
          disabled={loading}
          className="bg-black text-white px-5 py-3 rounded"
        >
          {loading
            ? "Creating..."
            : "Create FAQ"}
        </button>
      </form>
    </div>
  );
}
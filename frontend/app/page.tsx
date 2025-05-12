"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

type Annotation = {
  start: number;
  end: number;
  text: string;
  error: string;
  suggestion: string;
  explanation: string;
};

type Comment = {
  id: number;
  content: string;
  created_at: string;
};

type ValidationError = {
  type: string;
  loc: string[];
  msg: string;
  input: string;
  ctx: Record<string, unknown>;
  url: string;
};

type ErrorResponse = {
  detail: ValidationError[];
};

export default function EssayReportViewer() {
  const [essay, setEssay] = useState("");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    setError(null);
    axios.get<{ essay: string; annotations: Annotation[][] }>(`${apiUrl}/api/essay`)
      .then(res => {
        setEssay(res.data.essay);
        setAnnotations(res.data.annotations[0]);
      })
      .catch(() => setError("Failed to load essay."));

    axios.get<Comment[]>(`${apiUrl}/api/comments`)
      .then(res => setComments(res.data))
      .catch(() => setError("Failed to load comments."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post<Comment>(`${apiUrl}/api/comments`, { content: commentInput.trim() });
      setComments([res.data, ...comments]);
      setCommentInput("");
      setSuccess("Comment submitted successfully.");
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      if (errorResponse?.detail?.[0]?.msg) {
        setError(errorResponse.detail[0].msg);
      } else {
        setError("Failed to submit comment. Please try again later.");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  function renderEssay() {
    if (!annotations.length) return essay;
    let last = 0;
    const parts: React.ReactNode[] = [];
    annotations.forEach((ann, i) => {
      if (ann.start > last) {
        parts.push(<span key={`text-${i}`}>{essay.slice(last, ann.start)}</span>);
      }
      parts.push(
        <span
          key={`ann-${i}`}
          className="bg-red-100 border border-red-400 rounded px-1 cursor-pointer"
          onClick={() => setSelectedAnnotation(ann)}
        >
          {essay.slice(ann.start, ann.end)}
        </span>
      );
      last = ann.end;
    });
    if (last < essay.length) {
      parts.push(<span key="end">{essay.slice(last)}</span>);
    }
    return parts;
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace("AM", "am")
      .replace("PM", "pm");
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Essay + Annotations View</h1>
      <div className="bg-white p-6 rounded shadow mb-8">
        <div className="leading-relaxed text-lg">{renderEssay()}</div>
      </div>

      {/* Annotation Modal */}
      <Dialog open={!!selectedAnnotation} onOpenChange={() => setSelectedAnnotation(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="relative">
            <DialogTitle className="capitalize">{selectedAnnotation?.error}</DialogTitle>
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedAnnotation(null)}
              className="absolute right-2 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </DialogHeader>
          {/* Divider line */}
          <div className="border-b my-2" />
          <div className="text-sm text-muted-foreground">
            <div className="mb-7">
              <b>Explanation</b>
              <div>{selectedAnnotation?.explanation}</div>
            </div>
            <div className="mb-5 border rounded p-2 border-red-400 bg-red-50">
              <b>Actual Writing</b>
              <div>{selectedAnnotation?.text}</div>
            </div>
            <div className="border rounded p-2 border-green-400 bg-green-50">
              <b>Correction</b>
              <div>{selectedAnnotation?.suggestion}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-2">Comments</h2>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            className="flex-1"
            placeholder="Provide comments..."
            value={commentInput}
            onChange={handleInputChange}
          />
          <Button type="submit">Submit</Button>
        </form>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8 border rounded-lg bg-gray-50">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="border-b pb-2">
                <div>{c.content}</div>
                <div className="text-xs text-gray-500">{formatDate(c.created_at)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

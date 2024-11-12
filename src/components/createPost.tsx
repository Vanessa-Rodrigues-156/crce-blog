// app/components/CreatePostForm.tsx
"use client";

import { useState } from "react";
import { createPost } from "@/lib/api/createPost";

export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [user, setUser] = useState("");
  const [status, setStatus] = useState("draft");
  const [courseName, setCourseName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData = {
        status,
        title,
        description,
        content,
        image,
        user,
        courseName,
      };

      const response = await createPost(postData);

      console.log("Post created successfully:", response);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="User"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Submit Post
      </button>
    </form>
  );
}

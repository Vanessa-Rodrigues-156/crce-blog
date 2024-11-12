// app/actions/createPost.ts
"use server";

import { supabaseServer } from "@/lib/supabase-server";

interface PostData {
  status: string;
  title: string;
  description: string;
  content: string;
  image: string;
  user: string;
  courseName?: string;
}

export async function createPost(postData: PostData) {
  const { data, error } = await supabaseServer
    .from("posts")
    .insert([
      {
        status: postData.status,
        title: postData.title,
        description: postData.description,
        content: postData.content,
        image: postData.image,
        username: postData.user,
        courseName: postData.courseName,
      },
    ]);

  if (error) {
    console.error("Error inserting data:", error.message);
    throw new Error(error.message);
  }

  return data;
}

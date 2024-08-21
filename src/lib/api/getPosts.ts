"use server";
import { getauth } from "../getAuth";

interface Post {
  id: number;
  title: string;
  imageUrl: string;
  views: number;
  comment: number;
  valid: boolean;
  user: string;
  courseName: string;
  description: string;
  content: string;
}

export async function fetchPosts(
  courseName?: string,
  valid?: boolean,
): Promise<Post[]> {
  const authToken = await getauth();
  let url = `${process.env.BACKEND_URL}/items/posts`;
  const filters = [];

  if (courseName) {
    filters.push(`filter[courseName][_eq]=${encodeURIComponent(courseName)}`);
  }
  if (valid !== undefined) {
    filters.push(`filter[valid][_eq]=${valid}`);
  }

  if (filters.length > 0) {
    url += `?${filters.join("&")}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await response.json();

  return data.data.map((post: any) => ({
    id: post.id,
    title: post.title,
    courseName: post.courseName || "Uncategorized",
    description: post.description || "",
    content: post.content || "",
    imageUrl: post.image
      ? `${process.env.BACKEND_URL}/assets/${post.image}`
      : "https://via.placeholder.com/150",
    views: post.views || 0,
    comment: post.comments || 0,
    valid: post.valid ?? false,
    user: post.user || "none",
  }));
}

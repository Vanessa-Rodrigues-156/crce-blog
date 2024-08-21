"use server";
import { getauth } from "../getAuth";

export async function deletePostOnServer(id: number) {
  const authToken = await getauth();
  const response = await fetch(`${process.env.BACKEND_URL}/items/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  return { success: true, message: "Post deleted successfully" };
}

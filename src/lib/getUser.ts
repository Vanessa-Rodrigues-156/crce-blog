"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function checkUsername() {
  const cookieStore = cookies();
  const usernameCookie = cookieStore.get("username");

  if (usernameCookie && usernameCookie.value) {
    return usernameCookie.value;
  } else {
    // redirect("/signin");
  }
}

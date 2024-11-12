"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getauth() {
  const cookiestore = cookies();
  const authcookie = cookiestore.get("auth_token");

  if (authcookie && authcookie.value) {
    console.log(authcookie.value);
    return authcookie.value;
  } else {
    // redirect("/signin");
  }
}

"use server";

import { cookies } from "next/headers";

export const logoutUser = async () => {
  const cookiesStore = await cookies();
  cookiesStore.delete("userToken");
  return { success: true, message: "user logout successfully" };
};

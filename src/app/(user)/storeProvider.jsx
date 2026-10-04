"use client";
import { makeStore } from "@/store/store";
import { useState } from "react";
import { Provider } from "react-redux";

export default function StoreProvider({ children }) {
  // Create the store instance the first time this renders
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}

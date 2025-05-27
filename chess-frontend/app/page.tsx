"use client";

import { useEffect } from "react";
import socket from "@/lib/socket";

export default function HomePage() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server: ", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Chess Platform</h1>
    </main>
  );
}

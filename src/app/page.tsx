// app/pages/index.tsx
import Market from "@/components/Market";
import Table from "@/components/Table";
import React from "react";

export default function HomePage() {
  return (
    <article className="max-w-screen-lg min-h-screen px-2 py-4 m-auto">
      {/* TODO: Add more markets */}
      <Market />
      <Table />
    </article>
  );
}

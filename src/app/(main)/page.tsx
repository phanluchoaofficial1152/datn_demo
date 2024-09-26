"use server";

import HomePage from "@/components/Home";

export default async function Home() {
  return (
    <div className="px-6 py-6 sm:px-6 md:px-6 lg:px-16">
      <HomePage />
    </div>
  );
}

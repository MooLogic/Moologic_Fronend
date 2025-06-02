"use client";

import { AnimalDetails } from "@/components/animal-details";
import { DecorativeBackground } from "@/components/decorative-background";
import { useParams } from "next/navigation";

export default function AnimalDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <div className="p-6 text-red-500">Invalid cattle ID</div>;
  }

  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <AnimalDetails animalId={id} />
    </div>
  );
}
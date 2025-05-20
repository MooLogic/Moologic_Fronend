"use client";

import { AnimalDetails } from "@/components/animal-details";
import { DecorativeBackground } from "@/components/decorative-background";
import { useGetCattleByIdQuery } from "@/lib/service/cattleService";
import { useSession } from "next-auth/react";
interface AnimalDetailsPageProps {
  params: { id: string };
}
//get id from the url which is /id
// and pass it to the page
// this is a dynamic route
// this is a page that shows the details of the animal


export default function AnimalDetailsPage({ params }: AnimalDetailsPageProps) {
  // You may need to get accessToken from context, props, or another source
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken || ""; 
  const { data: animal, isLoading } = useGetCattleByIdQuery({ accessToken, id: params.id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!animal) {
    return <div>Animal not found</div>;
  }

  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <AnimalDetails animal={animal} />
    </div>
  );
}
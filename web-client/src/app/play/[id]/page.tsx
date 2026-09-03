import CloudPlayer from "@/components/CloudPlayer";

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <CloudPlayer gameId={resolvedParams.id} />;
}

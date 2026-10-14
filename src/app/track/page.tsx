import TrackingView from "@/components/track/TrackingView";

export const revalidate = 0;

export default async function TrackPage(props: {
  searchParams: Promise<{ spk?: string }>;
}) {
  const searchParams = await props.searchParams;
  const initialQuery = searchParams.spk || "";

  return <TrackingView initialQuery={initialQuery} />;
}

import { getProductionQueue } from "@/app/actions/production";
import ProductionBoard from "@/components/production/ProductionBoard";

export const revalidate = 0;

export default async function ProduksiPage() {
  const queue = await getProductionQueue();

  return <ProductionBoard initialItems={queue} />;
}

import { getCatalogItems } from "@/app/actions/catalog";
import KioskOrderFlow from "@/components/kiosk/KioskOrderFlow";

export const revalidate = 0;

export default async function KatalogPage() {
  const items = await getCatalogItems();

  return <KioskOrderFlow initialItems={items} />;
}

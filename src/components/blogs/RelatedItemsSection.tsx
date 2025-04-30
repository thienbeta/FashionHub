
import { RelatedProducts } from "./RelatedProducts";

interface RelatedItemsSectionProps {
  category: string;
  relatedProducts?: number[];
  relatedCombos?: number[];
}

export const RelatedItemsSection = ({ 
  category, 
  relatedProducts, 
  relatedCombos 
}: RelatedItemsSectionProps) => {
  if ((category === "product" && !relatedProducts) || 
      (category === "combo" && !relatedCombos)) {
    return null;
  }

  const title = category === "product" ? "Featured Products" : "Featured Combos";
  const ids = category === "product" ? relatedProducts : relatedCombos;
  const type = category === "product" ? "product" : "combo";

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <RelatedProducts ids={ids || []} type={type} />
    </div>
  );
};

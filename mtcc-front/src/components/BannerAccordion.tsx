import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useBannerData } from "@/hooks/useBannerData";
import { Loader2 } from "lucide-react";



export default function BannerAccordion() {
  const { bannerData, isLoading, error } = useBannerData();

  if (isLoading) return <div className="flex justify-center items-center"><Loader2 className="animate-spin " /></div>;
  if (error) return <div className="flex justify-center items-center">Error</div>;

  return (
    <Accordion type="single" collapsible>
      {bannerData && Object.entries(bannerData).map(([themeKey, themeData], index) => (
        <AccordionItem key={index} value={`item-${index}`}>
        <AccordionTrigger>{themeData.displayName}</AccordionTrigger>
        <AccordionContent>
          {themeData.banners.map((bannerUrl, index) => (
            <img className="mt-2" key={index} src={bannerUrl} alt={`${themeKey} banner`} />
          ))}
        </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}


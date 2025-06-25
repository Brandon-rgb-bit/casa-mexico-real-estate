import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
type ImageCarouselProps = {
  images: string[];
  alt: string;
};
const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt
}) => {
  if (!images || images.length === 0) {
    return <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
        <span className="text-gray-400">Sin imágenes</span>
      </div>;
  }
  return <Carousel className="mb-4">
      <CarouselContent>
        {images.map((src, i) => <CarouselItem key={i}>
            <img src={src} alt={alt} loading="lazy" className="w-full h-48 rounded-md object-contain" />
          </CarouselItem>)}
      </CarouselContent>
      {images.length > 1 && <>
          <CarouselPrevious className="text-base font-normal px-0 py-0 my-0 mx-[35px]" />
          <CarouselNext className="my-0 mx-[35px]" />
        </>}
    </Carousel>;
};
export default ImageCarousel;
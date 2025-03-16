import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import styles
import React from "react";

const Banner = () => {
  return (
    <div className="container-fluid mt-3">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={3000} // Faster transitions for dynamic feel
        showStatus={false}
        showIndicators={true}
        stopOnHover={true}
        transitionTime={800} // Smooth transitions
      >
        {/* Banner 1 */}
        <div>
          <img
            src="https://cdn.shopclues.com/images/banners/2025/Jan/20/Maharaja-sale-web-20Jan.jpg"
            className="rounded-3 w-100"
            style={{ height: "400px", objectFit: "cover" }}
            alt="Sale Banner 1"
          />
        </div>

        {/* Banner 2 */}
        <div>
          <img
            src="https://cdn.shopclues.com/images/banners/2025/Feb/07/Shopclues_Evo_Banner_2760X690.jpg"
            className="rounded-3 w-100"
            style={{ height: "400px", objectFit: "cover" }}
            alt="Sale Banner 2"
          />
        </div>

        {/* Banner 3 */}
        <div>
          <img
            src="https://cdn.shopclues.com/images/banners/2025/march/01/Holi-Special-web-28Feb25.jpg"
            className="rounded-3 w-100"
            style={{ height: "400px", objectFit: "cover" }}
            alt="Sale Banner 3"
          />
        </div>

        <div>
          <img
            src="https://cdn.shopclues.com/images/banners/2024/May/17/RefurbFeaturephone_Web_17thMay24.jpg"
            className="rounded-3 w-100"
            style={{ height: "400px", objectFit: "cover" }}
            alt="Sale Banner 3"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;

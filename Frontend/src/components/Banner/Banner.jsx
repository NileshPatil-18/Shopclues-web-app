import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import React from "react";

const Banner = () => {
  const banners = [
    "https://img.freepik.com/free-vector/flat-sale-banner-with-photo_23-2149026968.jpg?w=1200&t=st=1700000000~exp=1700000600~hmac=xxx",
    "https://img.freepik.com/free-vector/shopping-time-banner-with-realistic-map-cart-gift-bags-vector-illustration_548887-120.jpg?w=1200",
    "https://img.freepik.com/free-vector/gradient-sale-banner-template_23-2148934477.jpg?w=1200",
    "https://img.freepik.com/free-vector/flat-black-friday-sale-banner_23-2149066246.jpg?w=1200"
  ];

  return (
    <div className="container-fluid mt-3">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={3000}
        showStatus={false}
        showIndicators={true}
        stopOnHover={true}
        transitionTime={800}
      >
        {banners.map((banner, index) => (
          <div key={index}>
            <img
              src={banner}
              className="rounded-3 w-100"
              style={{ 
                height: "400px", 
                objectFit: "cover"
              }}
              alt={`Sale Banner ${index + 1}`}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
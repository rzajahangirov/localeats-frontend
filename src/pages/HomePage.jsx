import './HomePage.css';

const RESTAURANTS = [
  { id: 1, name: "Bistro En Couleur", category: "French", rating: 4.8, minOrder: 15, deliveryTime: "30-45 min", image: "/images/restaurant-hero.png" },
  { id: 2, name: "The Rustic Olive", category: "Italian", rating: 4.6, minOrder: 20, deliveryTime: "25-40 min", image: "/images/restaurant-hero.png" },
  { id: 3, name: "Spice Symphony", category: "Indian", rating: 4.9, minOrder: 10, deliveryTime: "35-50 min", image: "/images/restaurant-hero.png" },
  { id: 4, name: "Golden Dragon", category: "Chinese", rating: 4.5, minOrder: 15, deliveryTime: "20-35 min", image: "/images/restaurant-hero.png" },
];

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-bg"></div>
        <div className="home-hero-content animate-fade-in-up">
          <span className="hero-eyebrow">YOUR CULINARY JOURNEY STARTS HERE</span>
          <h1 className="hero-headline">
            Savor the extraordinary.<br/>
            Delivered to your door.
          </h1>
          <p className="hero-subheadline">
            Explore carefully curated local gems and internationally acclaimed flavors.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="restaurants-section">
        <div className="section-header">
          <h2 className="section-title">Curated for You</h2>
          <div className="section-filters">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Highly Rated</button>
            <button className="filter-btn">Newest</button>
            <button className="filter-btn">Offers</button>
          </div>
        </div>

        <div className="restaurants-grid">
          {RESTAURANTS.map((restaurant, index) => (
            <div className="restaurant-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }} key={restaurant.id}>
              <div className="card-image-box">
                <img src={restaurant.image} alt={restaurant.name} className="card-image" />
                <button className="favorite-btn" aria-label="Favorite">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{restaurant.name}</h3>
                  <div className="card-rating">
                    <svg viewBox="0 0 20 20" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{restaurant.rating}</span>
                  </div>
                </div>
                <span className="card-category">{restaurant.category}</span>
                <div className="card-meta">
                  <span className="meta-item">
                    Min. order ${restaurant.minOrder}
                  </span>
                  <span className="meta-dot">•</span>
                  <span className="meta-item">
                    {restaurant.deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

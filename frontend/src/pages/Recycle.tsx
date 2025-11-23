import { motion } from "framer-motion";
import { ExternalLink, MapPin, Heart, ShoppingBag, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface RecyclingCenter {
  type: string;
  properties: {
    id: number;
    name: string;
    address: string;
    distance_km: number;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

interface LocationState {
  lat: number;
  lng: number;
  loading: boolean;
  error: string | null;
}

const Recycle = () => {
  const [location, setLocation] = useState<LocationState>({
    lat: 0,
    lng: 0,
    loading: false,
    error: null,
  });
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

  const resellingPlatforms = [
    { name: "eBay", url: "https://www.ebay.com", description: "Global marketplace for electronics" },
    { name: "Swappa", url: "https://swappa.com", description: "Trusted tech marketplace" },
    { name: "Gazelle", url: "https://www.gazelle.com", description: "Buy and sell certified pre-owned devices" },
    { name: "Decluttr", url: "https://www.decluttr.com", description: "Instant valuations and free shipping" },
  ];

  const ngos = [
    { name: "World Computer Exchange", url: "https://worldcomputerexchange.org", description: "Bridging the digital divide" },
    { name: "Computers with Causes", url: "https://computerswithcauses.org", description: "Donate computers to those in need" },
    { name: "National Cristina Foundation", url: "https://cristina.org", description: "Technology for people with disabilities" },
    { name: "The Restart Project", url: "https://therestartproject.org", description: "Fixing electronics together" },
  ];

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: "Geolocation is not supported by your browser" }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          loading: false,
          error: null,
        });
        fetchNearbyCenters(latitude, longitude);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location permission denied. Please enable location access.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out.";
        }
        setLocation(prev => ({ ...prev, loading: false, error: errorMessage }));
      }
    );
  };

  const fetchNearbyCenters = async (lat: number, lng: number) => {
    setLoadingCenters(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/nearby?lat=${lat}&lng=${lng}&radius=10&limit=20`
      );
      const data = await response.json();
      setCenters(data.features || []);
    } catch (error) {
      console.error("Error fetching recycling centers:", error);
      setLocation(prev => ({ ...prev, error: "Failed to fetch nearby centers" }));
    } finally {
      setLoadingCenters(false);
    }
  };

  // Initialize Leaflet map when location is available
  useEffect(() => {
    if (location.lat && location.lng && centers.length > 0) {
      initMap();
    }
  }, [location.lat, location.lng, centers]);

  const initMap = () => {
    // Dynamically load Leaflet CSS and JS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => createMap();
      document.body.appendChild(script);
    } else {
      createMap();
    }
  };

  const createMap = () => {
    const L = (window as any).L;
    const mapElement = document.getElementById('recycling-map');
    if (!mapElement) return;

    // Clear existing map
    mapElement.innerHTML = '';

    // Create map
    const map = L.map('recycling-map').setView([location.lat, location.lng], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add user location marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
    });

    L.marker([location.lat, location.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<strong>Your Location</strong>');

    // Add recycling center markers
    centers.forEach((center) => {
      const [lng, lat] = center.geometry.coordinates;
      const recycleIcon = L.divIcon({
        className: 'custom-recycle-marker',
        html: '<div style="background: #10b981; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 18px;">♻</span></div>',
        iconSize: [30, 30],
      });

      L.marker([lat, lng], { icon: recycleIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 8px;">
            <strong style="color: #10b981; font-size: 14px;">${center.properties.name}</strong><br/>
            <span style="color: #666; font-size: 12px;">${center.properties.address}</span><br/>
            <span style="color: #3b82f6; font-size: 12px; font-weight: 600;">📍 ${center.properties.distance_km} km away</span>
          </div>
        `);
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Recycle Your Devices</h1>
          <p className="text-muted-foreground">Choose the best option for your e-waste</p>
        </motion.div>

        <div className="space-y-8">
          {/* Reselling Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-8 glow-soft"
          >
            <div className="flex items-center space-x-3 mb-6">
              <ShoppingBag className="w-8 h-8 text-accent animate-glow-pulse" />
              <h2 className="text-2xl font-bold gradient-text">Reselling Platforms</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Give your device a second life by selling it to someone who needs it. These platforms make it easy to resell your electronics safely.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {resellingPlatforms.map((platform, index) => (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass-panel rounded-xl p-6 hover:glow-primary transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-primary group-hover:gradient-text transition-all">
                        {platform.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{platform.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Donation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-8 glow-soft"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Heart className="w-8 h-8 text-accent animate-glow-pulse" />
              <h2 className="text-2xl font-bold gradient-text">Donate to NGOs</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Make a difference by donating your devices to organizations that refurbish and distribute them to communities in need.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {ngos.map((ngo, index) => (
                <motion.a
                  key={ngo.name}
                  href={ngo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass-panel rounded-xl p-6 hover:glow-accent transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-primary group-hover:gradient-text-accent transition-all">
                        {ngo.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{ngo.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Scrap Yards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-2xl p-8 glow-soft"
          >
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="w-8 h-8 text-accent animate-glow-pulse" />
              <h2 className="text-2xl font-bold gradient-text">Nearby Recycling Centers</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Find certified e-waste recycling centers near you. These facilities properly dismantle and recycle electronics to recover valuable materials.
            </p>

            {/* Map Container */}
            {!location.lat && !location.loading && (
              <div className="glass-panel rounded-xl overflow-hidden h-96 relative group">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <div className="text-center space-y-4">
                    <Navigation className="w-16 h-16 text-accent mx-auto animate-float" />
                    <p className="text-lg font-semibold gradient-text">Interactive Map</p>
                    <p className="text-sm text-muted-foreground max-w-md px-4">
                      Click below to enable location services and find certified e-waste recycling centers near you
                    </p>
                    <Button 
                      onClick={getLocation}
                      className="bg-primary hover:bg-primary/90 glow-primary"
                      disabled={location.loading}
                    >
                      {location.loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Getting Location...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4 mr-2" />
                          Enable Location
                        </>
                      )}
                    </Button>
                    {location.error && (
                      <p className="text-sm text-red-500 mt-2">{location.error}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {location.loading && (
              <div className="glass-panel rounded-xl h-96 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
              </div>
            )}

            {location.lat && location.lng && (
              <div className="space-y-4">
                <div 
                  id="recycling-map" 
                  className="glass-panel rounded-xl overflow-hidden h-96 w-full"
                  style={{ minHeight: '400px' }}
                />
                
                {loadingCenters && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 text-accent animate-spin mr-2" />
                    <span className="text-muted-foreground">Loading nearby centers...</span>
                  </div>
                )}

                {!loadingCenters && centers.length > 0 && (
                  <div className="glass-panel rounded-xl p-6">
                    <h3 className="text-lg font-semibold gradient-text mb-4">
                      Found {centers.length} centers nearby
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {centers.slice(0, 10).map((center) => (
                        <div 
                          key={center.properties.id}
                          className="glass-panel p-4 rounded-lg hover:glow-primary transition-all cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-primary">
                                {center.properties.name}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {center.properties.address}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <span className="text-accent font-semibold">
                                {center.properties.distance_km} km
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!loadingCenters && centers.length === 0 && (
                  <div className="glass-panel rounded-xl p-8 text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No recycling centers found within 10km radius.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-lg">
                <h4 className="font-semibold text-accent mb-2">✓ Certified Centers</h4>
                <p className="text-sm text-muted-foreground">EPA-approved recycling facilities</p>
              </div>
              <div className="glass-panel p-4 rounded-lg">
                <h4 className="font-semibold text-accent mb-2">✓ Free Drop-off</h4>
                <p className="text-sm text-muted-foreground">Most centers offer free disposal</p>
              </div>
              <div className="glass-panel p-4 rounded-lg">
                <h4 className="font-semibold text-accent mb-2">✓ Responsible</h4>
                <p className="text-sm text-muted-foreground">Environmentally safe processing</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Recycle;
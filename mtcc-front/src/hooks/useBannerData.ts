import { useEffect, useState } from 'react';

interface BannerThemeData {
  displayName: string;
  banners: string[];
}

interface BannerData {
  [theme: string]: BannerThemeData;
}

export const useBannerData = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/banners`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBannerData(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  return { bannerData, isLoading, error };
};

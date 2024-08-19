import axios from 'axios';
import { config } from '../config';

const { GIPHY_API_KEY } = config;

interface GifFormat {
  url: string;
  width: string;
  height: string;
  size: string;
}

interface MediaFormats {
  fixed_height: GifFormat;
  fixed_height_small: GifFormat;
  fixed_width: GifFormat;
  fixed_width_small: GifFormat;
  downsized: GifFormat;
  downsized_large: GifFormat;
  downsized_medium: GifFormat;
  downsized_small: GifFormat;
  downsized_still: GifFormat;
  original: GifFormat;
  original_still: GifFormat;
}

interface GifResult {
  id: string;
  title: string;
  images: MediaFormats;
  url: string;
}

interface GifResponse {
  data: GifResult[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
}

export class Giphy {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.giphy.com/v1/gifs',
    });
  }

  private getRandomElement(array: GifResult[]): GifResult {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  public async getExactGIF(query: string) {
    const results = await this.client.get<GifResponse>(
      `/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=1`,
    );

    if (results.data) {
      const gif = results.data.data[0];
      return gif.url;
    }
  }

  public async getHeuristicGIF(query: string) {
    const results = await this.client.get<GifResponse>(
      `/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=10`,
    );

    if (results.data) {
      const randomElement = this.getRandomElement(results.data.data);
      return randomElement.url;
    }
  }
}

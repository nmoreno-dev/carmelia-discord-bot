import axios from 'axios';
import { config } from '../config';

const { TENOR_API_KEY } = config;

interface GifFormat {
  url: string;
  duration: number;
  preview: string;
  dims: [number, number];
  size: number;
}

interface MediaFormats {
  nanowebppreview_transparent: GifFormat;
  webp: GifFormat;
  nanogifpreview: GifFormat;
  webppreview_transparent: GifFormat;
  webm: GifFormat;
  webp_transparent: GifFormat;
  tinywebp_transparent: GifFormat;
  nanomp4: GifFormat;
  tinymp4: GifFormat;
  tinywebm: GifFormat;
  nanowebp_transparent: GifFormat;
  nanogif: GifFormat;
  tinygifpreview: GifFormat;
  tinygif: GifFormat;
  mediumgif: GifFormat;
  mp4: GifFormat;
  gifpreview: GifFormat;
  loopedmp4: GifFormat;
  tinywebppreview_transparent: GifFormat;
  gif: GifFormat;
  nanowebm: GifFormat;
}

interface GifResult {
  id: string;
  title: string;
  media_formats: MediaFormats;
  created: number;
  content_description: string;
  itemurl: string;
  url: string;
  tags: string[];
  flags: string[];
  hasaudio: boolean;
  content_description_source: string;
}

interface GifResponse {
  results: GifResult[];
  next: string;
}

export class Tenor {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://tenor.googleapis.com/v2',
    });
  }

  private getRandomElement(array: GifResult[]): GifResult {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  public async getExactGIF(query: string) {
    const results = await this.client.get<GifResponse>(
      `/search?q=${query}&key=${TENOR_API_KEY}&country=${'US'}&limit=${1}`,
    );

    if (results.data) {
      const randomElement = results.data.results[0];
      return randomElement.url;
    }
  }

  public async getHeuristicGIF(query: string) {
    const results = await this.client.get<GifResponse>(
      `/search?q=${query}&key=${TENOR_API_KEY}&country=${'US'}&limit=${10}`,
    );

    if (results.data) {
      const randomElement = this.getRandomElement(results.data.results);
      return randomElement.url;
    }
  }
}

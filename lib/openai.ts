import OpenAI, { toFile } from 'openai';

let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export type DisneyStyle =
  | 'pixar-3d'
  | 'classic-disney'
  | 'disney-princess';

const stylePrompts: Record<DisneyStyle, string> = {
  'pixar-3d': `Transform this image into a Pixar 3D animated character style. Apply these characteristics:
    - Smooth, stylized 3D rendering with subsurface scattering on skin
    - Large, expressive eyes with detailed iris reflections and catchlights
    - Slightly exaggerated proportions (larger head, expressive features)
    - Soft, appealing lighting with warm highlights
    - Clean, polished look like characters from Toy Story, Up, or Inside Out
    - Maintain the subject's likeness but stylized in Pixar's signature aesthetic
    - Rich, vibrant colors with subtle gradients
    - Professional Pixar-quality rendering`,

  'classic-disney': `Transform this image into a classic Disney 2D animation style. Apply these characteristics:
    - Traditional hand-drawn animation look from Disney's golden age
    - Soft, flowing lines with elegant curves
    - Warm, painterly color palette with subtle gradients
    - Expressive eyes with Disney's signature sparkle
    - Graceful, fluid character design like Snow White, Cinderella, or Sleeping Beauty
    - Romantic, storybook quality with soft lighting
    - Maintain likeness but with timeless Disney elegance
    - Subtle cel-shading with beautiful color harmony`,

  'disney-princess': `Transform this image into a Disney Princess style character. Apply these characteristics:
    - Glamorous, elegant Disney princess aesthetic
    - Large, expressive eyes with long lashes and highlights
    - Flawless, glowing skin with rosy cheeks
    - Luxurious, flowing hair with volume and movement
    - Regal, graceful features inspired by Ariel, Belle, Rapunzel, and Moana
    - Dreamy atmosphere with soft lighting
    - Rich, jewel-toned colors with golden accents
    - Romantic, storybook quality lighting`,
};

export async function transformToDisney(
  imageBuffer: Buffer,
  style: DisneyStyle = 'pixar-3d'
): Promise<Buffer> {
  const imageFile = await toFile(imageBuffer, 'image.png', { type: 'image/png' });

  const prompt = stylePrompts[style];

  const response = await getOpenAI().images.edit({
    model: 'gpt-image-1',
    image: imageFile,
    prompt,
    size: '1024x1024',
  });

  const imageData = response.data?.[0];

  if (!imageData) {
    throw new Error('No image data returned from OpenAI');
  }

  if (imageData.b64_json) {
    return Buffer.from(imageData.b64_json, 'base64');
  } else if (imageData.url) {
    const imageResponse = await fetch(imageData.url);
    const arrayBuffer = await imageResponse.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  throw new Error('No image URL or base64 data returned');
}

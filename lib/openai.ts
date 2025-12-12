import OpenAI, { toFile } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type DisneyStyle =
  | 'pixar-3d'
  | 'classic-disney'
  | 'disney-princess'
  | 'disney-villain'
  | 'frozen-style'
  | 'encanto-style';

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

  'disney-villain': `Transform this image into a Disney Villain style character. Apply these characteristics:
    - Dramatic, theatrical Disney villain aesthetic
    - Sharp, angular features with striking bone structure
    - Intense, piercing eyes with dramatic shadows
    - Bold, high-contrast color palette (deep purples, greens, blacks)
    - Theatrical lighting with dramatic shadows
    - Elegant yet menacing presence like Maleficent, Ursula, or Scar
    - Sophisticated, powerful aura
    - Rich details and ornate styling`,

  'frozen-style': `Transform this image into the Frozen movie animation style. Apply these characteristics:
    - Modern Disney 3D animation with crystalline quality
    - Cool color palette with icy blues, silvers, and whites
    - Frost effects and snowflake details
    - Soft, luminous skin with subtle cool undertones
    - Large, expressive eyes like Elsa and Anna
    - Elegant, Nordic-inspired aesthetic
    - Ice crystal highlights
    - Beautiful, wintry atmosphere`,

  'encanto-style': `Transform this image into the Encanto movie animation style. Apply these characteristics:
    - Vibrant, Colombian-inspired Disney animation
    - Warm, rich color palette with tropical florals
    - Curly, voluminous hair with beautiful texture
    - Expressive features with warm, glowing skin tones
    - Golden accents and butterfly motifs
    - Lush, colorful environment elements
    - Family-oriented warmth and charm like Mirabel
    - Celebration of diversity and natural beauty`,
};

export async function transformToDisney(
  imageBuffer: Buffer,
  style: DisneyStyle = 'pixar-3d'
): Promise<Buffer> {
  const imageFile = await toFile(imageBuffer, 'image.png', { type: 'image/png' });

  const prompt = stylePrompts[style];

  const response = await openai.images.edit({
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

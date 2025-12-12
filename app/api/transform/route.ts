import { NextRequest, NextResponse } from 'next/server';
import { transformToDisney, DisneyStyle } from '@/lib/openai';
import { uploadImage } from '@/lib/firebase';

const validStyles: DisneyStyle[] = [
  'pixar-3d',
  'classic-disney',
  'disney-princess',
  'disney-villain',
  'frozen-style',
  'encanto-style',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const style = (formData.get('style') as DisneyStyle) || 'pixar-3d';

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!validStyles.includes(style)) {
      return NextResponse.json({ error: 'Invalid style selected' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Transform to Disney style
    const disneyBuffer = await transformToDisney(buffer, style);

    // Generate unique filename
    const filename = `disney_${style}_${Date.now()}.png`;

    // Upload to Firebase
    const url = await uploadImage(disneyBuffer, filename);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Transform error:', error);
    return NextResponse.json(
      { error: 'Failed to transform image' },
      { status: 500 }
    );
  }
}

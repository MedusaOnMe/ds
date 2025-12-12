import { NextResponse } from 'next/server';
import { getGalleryImages } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Gallery error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}

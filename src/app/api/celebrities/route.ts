import { NextResponse } from 'next/server';
import { celebrities } from '@/lib/celebrities';

export async function GET() {
  // Return only essential info, not system prompts
  const publicCelebrities = celebrities.map(c => ({
    id: c.id,
    name: c.name,
    category: c.category,
    bio: c.bio,
    imageUrl: c.imageUrl,
    era: c.era,
  }));

  return NextResponse.json(publicCelebrities);
}

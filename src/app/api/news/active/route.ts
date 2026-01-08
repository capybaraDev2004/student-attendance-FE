import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/news/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Không cache để luôn lấy tin tức mới nhất
    });

    if (!response.ok) {
      return NextResponse.json({ news: [] }, { status: 200 });
    }

    const news = await response.json();
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching active news:', error);
    return NextResponse.json({ news: [] }, { status: 200 });
  }
}


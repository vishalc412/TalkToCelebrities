'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

interface Celebrity {
  id: string;
  name: string;
  category: string;
  bio: string;
  imageUrl: string;
  era?: string;
}

export default function CelebrityGrid() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/celebrities')
      .then(res => res.json())
      .then(data => setCelebrities(data));
  }, []);

  const categories = ['all', 'hollywood', 'bollywood', 'scientist'];
  const filtered = filter === 'all'
    ? celebrities
    : celebrities.filter(c => c.category === filter);

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 justify-center flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full capitalize transition-colors ${
              filter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Celebrity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(celebrity => (
          <Card
            key={celebrity.id}
            className="cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => router.push(`/chat/${celebrity.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={celebrity.imageUrl} alt={celebrity.name} />
                  <AvatarFallback>{celebrity.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-xl">{celebrity.name}</h3>
                  {celebrity.era && (
                    <p className="text-sm text-gray-500">{celebrity.era}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">{celebrity.bio}</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Chat
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

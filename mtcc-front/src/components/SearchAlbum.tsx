import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { AlbumCard } from './AlbumCard';
import { SelectedAlbumWithMeta } from '@/services/useSelectedAlbumStore';

const albumSchema = z.object({
  name: z.string().max(80),
});

type Album = z.infer<typeof albumSchema>

export default function SearchAlbum() {
  const [albums, setAlbums] = useState<[SelectedAlbumWithMeta] | []>([]);

  const { register, handleSubmit } = useForm<Album>({
    resolver: zodResolver(albumSchema),
  })

  const getAlbums = async (albumName: string): Promise<[SelectedAlbumWithMeta] | []> => {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/search?album=${albumName}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }

  const onSubmit = async (album: Album) => {
    if (album.name) {
      toast.promise(
        getAlbums(album.name),
        {
          loading: 'Searching albums...',
          success: (res) => {
            setAlbums(res);
            return `${res.length} albums found`
          },
          error: (err) => `${err.toString()}`,
        },
      );
    }
  }

  return (
    <div className="flex items-center space-x-2 pt-16">
      <div className=''>
        <div className='flex justify-center pb-20'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex space-x-2'>
              <Input type="text" className="px-3 py-2 w-80" placeholder="Search for album..." {...register('name')} />
              <Button type="submit" className="px-3 py-2">Search</Button>
            </div>
          </form>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>
    </div>
  )
}

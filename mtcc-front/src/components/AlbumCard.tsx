import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "./ui/button";
import { SelectedAlbumWithMeta, useSelectedAlbumStore } from "@/services/useSelectedAlbumStore";

export const AlbumCard: React.FC<{album: SelectedAlbumWithMeta}> = ({ album }) => {
  const setSelectedAlbum = useSelectedAlbumStore(state => state.setSelectedAlbum);

  const handleSelect = () => {
    setSelectedAlbum({
      id: album.id,
      title: album.title,
      performer: album.performer,
      nbTracks: album.nbTracks,
      duration: album.duration,
      cover: album.cover,
      releaseDate: album.releaseDate,
    });
  };

  return (
    <Card className="w-[350px] my-2">
      <CardHeader>
        <CardTitle>{album.title}</CardTitle>
        <CardDescription>by {album.performer}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={album.cover} alt={`${album.title} cover`} />
        <p>Release Date: {album.releaseDate}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSelect} variant="outline">Select</Button>
      </CardFooter>
    </Card>
  )
}
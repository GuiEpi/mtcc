import deezer

client = deezer.Client()

def search_by_research(research: str) -> list[deezer.Album]:
        albums = []
        try:
            result = client.search(research)
            for data in result[:20]:
                album = data.get_album()
                if album.id not in [a.id for a in albums]:
                    albums.append(album)
        except Exception as e:
            logger.error(f"Album not found for research {research} : {e}")
            return albums
        return albums

def search_by_album_performer() -> deezer.Album | None:
    album = None
    if nfo_properties:
        try:
            artists = client.search_artists(
                nfo_properties["album_performer"]
            )
            for artist in artists[:10]:
                for album in artist.get_albums():
                    if nfo_properties["album"] == album.title:
                        update_properties(album)
                        return album
        except Exception as e:
            logger.error(
                f"Album not found for performer {nfo_properties['album_performer']} : {e}"
            )
            return album
    return album

def search_by_album() -> deezer.Album | None:
        album = None
        if nfo_properties:
            try:
                albums = client.search_albums(nfo_properties["album"])
                for album in albums[:10]:
                    if nfo_properties["album"] == album.title:
                        update_properties(album)
                        return album
            except Exception as e:
                logger.error(
                    f"Album not found for album {nfo_properties['album']} : {e}"
                )
                return album
        return album

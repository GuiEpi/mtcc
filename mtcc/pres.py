from mako.template import Template
from config import setup_logger
import deezer


class Pres:
    def __init__(
        self,
        settings: dict,
        nfo_properties: dict = {},
        upload_infos: dict = {},
    ) -> None:
        self.logger = setup_logger(__name__)
        self.settings = settings
        self.nfo_properties = nfo_properties
        self.upload_infos = upload_infos
        self.properties = None
        self.client = deezer.Client()
        self.torrent_name = ""
        self.template = Template(filename="./templates/pres.mako")

    def __str__(self):
        return self.template.render(
            album=self.properties,
            nfo=self.nfo_properties,
            upload=self.upload_infos,
            settings=self.settings,
        )

    def search(self, research: str = None) -> deezer.Album | list[deezer.Album] | None:
        if research:
            return self._search_by_research(research)
        else:
            return self._search_by_album() or self._search_by_album_performer()

    def _search_by_research(self, research: str) -> list[deezer.Album]:
        albums = []
        try:
            result = self.client.search(research)
            for data in result[:20]:
                album = data.get_album()
                if album.id not in [a.id for a in albums]:
                    albums.append(album)
        except Exception as e:
            self.logger.error(f"Album not found for research {research} : {e}")
            return albums
        return albums

    def _search_by_album_performer(self) -> deezer.Album | None:
        album = None
        if self.nfo_properties:
            try:
                artists = self.client.search_artists(
                    self.nfo_properties["album_performer"]
                )
                for artist in artists[:10]:
                    for album in artist.get_albums():
                        if self.nfo_properties["album"] == album.title:
                            self.update_properties(album)
                            return album
            except Exception as e:
                self.logger.error(
                    f"Album not found for performer {self.nfo_properties['album_performer']} : {e}"
                )
                return album
        return album

    def _search_by_album(self) -> deezer.Album | None:
        album = None
        if self.nfo_properties:
            try:
                albums = self.client.search_albums(self.nfo_properties["album"])
                for album in albums[:10]:
                    if self.nfo_properties["album"] == album.title:
                        self.update_properties(album)
                        return album
            except Exception as e:
                self.logger.error(
                    f"Album not found for album {self.nfo_properties['album']} : {e}"
                )
                return album
        return album

    def update_properties(self, album: deezer.Album) -> None:
        self.properties = album
        try:
            if self.nfo_properties["format"] == "MPEG Audio":
                self.torrent_name = f"[{album.genres[0].name}] {album.artist.name} - {album.title} ({album.record_type.upper()}) [{album.release_date.strftime('%Y')}] [MP3, {int(self.nfo_properties['bit_rate'] / 1000)}-{int(self.nfo_properties['sampling_rate'] / 1000)}] KK"
            else:
                self.torrent_name = f"[{album.genres[0].name}] {album.artist.name} - {album.title} ({album.record_type.upper()}) [{album.release_date.strftime('%Y')}] [{self.nfo_properties['format']}, {self.nfo_properties['bit_depth']}-{int(self.nfo_properties['sampling_rate'] / 1000)}] KK"
        except Exception as e:
            self.logger.error(f"Error during torrent name : {e}")

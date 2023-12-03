from mako.template import Template
from src.models.pres import PresModel, SettingsModel
import deezer
from src.config import MTCC_LINK


class PresGenerator(PresModel):
    def __init__(
        self,
        album: deezer.Album,
        settings: SettingsModel,
    ) -> None:
        super().__init__()
        self.album = album
        self.mtcc_link = MTCC_LINK
        self.settings = settings
        self.template = Template(filename="src/templates/pres.mako")
        self.settings.banner_theme = f"{MTCC_LINK}/themes/{settings.banner_theme}"
        self._set_torrent_name()

    def __str__(self):
        return self.template.render(
            settings=self.settings, properties=self.album, mtcc_link=self.mtcc_link
        )

    def _set_torrent_name(self) -> None:
        try:
            genre = self.album.genres[0].name
        except IndexError:
            genre = "Unknown"

        if self.settings.codec == "MP3":
            self.torrent_name = f"[{genre}] {self.album.artist.name} - {self.album.title} ({self.album.record_type.upper()}) [{self.settings.codec}, {self.settings.audio_bit_rate} kb/s] {self.settings.tag}".strip()
        elif "FLAC" in self.settings.codec:
            if len(self.settings.codec.split(" ")) > 1:
                # come from frontend
                self.settings.codec = self.settings.codec.split(" ")[0]
            self.torrent_name = f"[{genre}] {self.album.artist.name} - {self.album.title} ({self.album.record_type.upper()}) [{self.settings.codec}, {self.settings.bit_depth} Bit {self.settings.frequency}] {self.settings.tag}".strip()

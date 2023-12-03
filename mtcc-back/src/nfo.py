from mako.template import Template
from pymediainfo import MediaInfo
from fastapi import File
import re
from src.models.nfo import NfoModel, TrackModel, PresSettingsModel
from src.config import MTCC_LINK
from src.libs.utils import convert_size
from typing import Union


class NfoBuilder(NfoModel):
    __name__ = "mtcc Nfo Builder"
    __version__ = "0.1.1"

    def __init__(self, ripper: str = "", uploader: str = "") -> None:
        super().__init__()
        self.nfo_name = self.__name__
        self.nfo_version = self.__version__
        self.nfo_link = MTCC_LINK
        self.ripped_by = ripper
        self.posted_by = uploader

    def __str__(self) -> str:
        if not self.template:
            raise ValueError("Template is not defined")
        return self.template.render(properties=self)

    def parse(self, files: list[File]) -> None:
        if not files:
            raise ValueError("No files provided")
        total_size = 0
        total_playing_time = 0
        media_info = self._get_media_info(files)
        for info in media_info:
            try:
                general_info = info["tracks"][0]
                audio_info = info["tracks"][1]
            except KeyError:
                raise ValueError(
                    "Could not find expected track information in media info"
                )

            if not "audio" in general_info.get("internet_media_type", ""):
                continue

            try:
                self.artist = general_info.get("performer", "")
                self.album = general_info.get("album", "")
                self.title = f"{self.artist} - {self.album}"
                self.genre = general_info.get("genre", "")
                self.year = general_info.get("recorded_date", "")
                self.source = general_info.get("source", "")
                # no used but here
                self.ripper = general_info.get("ripper", "")

                if audio_info.get("channel_s") == 2:
                    self.channels = "Stereo"
                else:
                    self.channels = "Mono"

                if audio_info.get("format") == "FLAC":
                    self.codec = f"{audio_info.get('format_info', '')} ({audio_info.get('format')})"
                    self.quality = audio_info.get("compression_mode")
                    self.channels += f" / {audio_info.get('other_sampling_rate', [''])[0]} / {audio_info.get('other_bit_depth', [''])[0]}"
                    pres_setting_codec = audio_info.get("format")
                    pres_setting_bitrate = f"{audio_info.get('sampling_rate', 0) * audio_info.get('channel_s', 0) * audio_info.get('bit_depth', 0) / 1000}"
                elif audio_info.get("format") == "MPEG Audio":
                    format_ = "MPEG"
                    version = self._extract_number(audio_info.get("format_version"))
                    self.codec = f"{audio_info.get('writing_library', '')}"
                    self.version = (
                        f"{format_} {version} {audio_info.get('format_profile', '')}"
                    )
                    self.quality = f"{audio_info.get('compression_mode', '')}, (avg. bitrate: {general_info.get('other_overall_bit_rate', [''])[0]})"
                    self.channels += (
                        f" / {audio_info.get('other_sampling_rate', [''])[0]}"
                    )
                    pres_setting_codec = "MP3"
                    pres_setting_bitrate = str(
                        round(audio_info.get("bit_rate", 0) / 1000)
                    )

                pres_setting_frequency = (
                    str(audio_info.get("sampling_rate", 0) / 1000) + " kHz"
                )
                pres_setting_bit_depth = str(audio_info.get("bit_depth", ""))
                self.cover = general_info.get("cover_type", "")

                total_size += general_info.get("file_size", 0)
                total_playing_time += audio_info.get("duration", 0)
                self.tracklist.append(
                    TrackModel(
                        name=general_info.get("track_name", ""),
                        position=general_info.get("track_name_position", ""),
                        duration=self._format_duration(general_info.get("duration", 0)),
                    )
                )
            except KeyError as e:
                raise ValueError(f"Could not find expected key in general info: {e}")

        self.size = convert_size(total_size)
        self.playing_time = self._format_duration(total_playing_time)
        self.track_name_maxlen = (
            max(len(track.name) for track in self.tracklist) if self.tracklist else 0
        )
        self.tracklist.sort(key=lambda track: int(track.position))
        self._set_template()
        self.pres_settings = PresSettingsModel(
            codec=pres_setting_codec,
            frequency=pres_setting_frequency,
            audio_bit_rate=pres_setting_bitrate,
            bit_depth=pres_setting_bit_depth,
        )

    def _set_template(self) -> None:
        with open(f"src/templates/nfo.mako", "r") as template_file:
            self.template = Template(template_file.read())

    def _get_media_info(self, files: list[File]):
        media_info = []
        for file in files:
            media_info.append(MediaInfo.parse(file.file).to_data())
        return media_info

    def _format_duration(self, duration: int) -> str:
        hours, remainder = divmod(duration // 1000, 3600)
        minutes, seconds = divmod(remainder, 60)
        if hours > 0:
            return f"{hours:02}:{minutes:02}:{seconds:02}"
        else:
            return f"{minutes:02}:{seconds:02}"

    def _extract_number(self, text: str) -> Union[list[str], None]:
        match = re.search(r"\d+", text)
        return match.group() if match else None

from pydantic import BaseModel


class TrackModel(BaseModel):
    name: str
    position: str
    duration: str


class PresSettingsModel(BaseModel):
    codec: str = ""
    audio_bit_rate: str = ""
    frequency: str = ""
    bit_depth: str = ""


class NfoModel(BaseModel):
    title: str = ""
    artist: str = ""
    album: str = ""
    genre: str = ""
    source: str = ""
    year: str = ""
    ripper: str = ""
    codec: str = ""
    version: str = ""
    quality: str = ""
    channels: str = ""
    ripped_by: str = ""
    posted_by: str = ""
    included: str = "NFO"
    cover: str = ""
    playing_time: str = ""
    size: str = ""
    tracklist: list[TrackModel] = []
    nfo_name: str = ""
    nfo_version: str = ""
    nfo_link: str = ""
    track_name_maxlen: int = 0
    pres_settings: PresSettingsModel = {}
    template: str = ""

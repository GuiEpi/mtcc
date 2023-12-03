from pydantic import BaseModel
import deezer


class SettingsModel(BaseModel):
    codec: str
    frequency: str
    audio_bit_rate: str
    bit_depth: str
    nb_files: str
    total_size: str
    banner_theme: str
    account_link: str
    tag: str


class PresModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True

    settings: SettingsModel = {}
    album: deezer.Album = None
    torrent_name: str = ""
    mtcc_link: str = ""
    template: str = ""


class UploadInfosModel(BaseModel):
    codec: str
    frequency: str
    audioBitRate: int
    nbFiles: int
    totalSize: int
    bannerTheme: str
    accountLink: str
    tag: str


class GetPresModel(BaseModel):
    id: int
    settings: UploadInfosModel


class PresContentResponseModel(BaseModel):
    torrentName: str
    pres: str

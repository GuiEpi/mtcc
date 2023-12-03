from pydantic import BaseModel


class TorrentContentResponseWithoutPresModel(BaseModel):
    nfoDownloadLink: str
    nfo: str


class TorrentContentResponseModel(BaseModel):
    nfoDownloadLink: str
    torrentName: str
    pres: str
    nfo: str

from pydantic import BaseModel
from datetime import date


class AlbumResponseModel(BaseModel):
    id: int
    title: str
    performer: str
    nbTracks: int
    duration: str
    cover: str
    releaseDate: date

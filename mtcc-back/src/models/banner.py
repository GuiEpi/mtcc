from pydantic import BaseModel


class BannerModel(BaseModel):
    displayName: str
    banners: list[str]

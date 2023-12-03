import math
from typing import Optional, Union
from fastapi import UploadFile, HTTPException
import os
import deezer
import src.config as config
from time import time
from uuid import uuid4
from tempfile import NamedTemporaryFile
import re
import magic

client = deezer.Client()


class InvalidMimeTypeError(Exception):
    def __init__(self, filename, message="Invalid file type"):
        self.message = f"{message}: {filename}"
        super().__init__(self.message)


class FileSizeExceededError(Exception):
    def __init__(self, filename, message="File size exceeds limit"):
        self.message = f"{message}: {filename}"
        super().__init__(self.message)


async def validate_file_size(file: UploadFile, max_size: int) -> bool:
    return file.file_size <= max_size


async def validate_mime_type(file: UploadFile) -> str:
    contents = await file.read(2048)
    mime_type = magic.from_buffer(contents, mime=True)
    await file.seek(0)
    return mime_type


async def validate_files(
    files: list[UploadFile],
) -> Union[None, InvalidMimeTypeError, FileSizeExceededError]:
    for file in files:
        mime_type = await validate_mime_type(file)
        if mime_type not in config.ALLOWED_MIME_TYPES:
            raise InvalidMimeTypeError(file.filename)

        max_size = config.ALLOWED_MIME_TYPES[mime_type]
        if not await validate_file_size(file, max_size):
            raise FileSizeExceededError(file.filename)


def extract_bits(text: str) -> Optional[str]:
    match = re.search(r"(\d+)\s*bits", text)
    if match:
        return match.group(1)
    else:
        return ""


def format_duration(duration_in_seconds: int) -> str:
    minutes = duration_in_seconds // 60
    hours = minutes // 60
    minutes = minutes % 60

    formatted_duration = []

    if hours > 0:
        hour_str = f"{hours} heure{'s' if hours > 1 else ''}"
        formatted_duration.append(hour_str)

    if minutes > 0:
        minute_str = f"{minutes} minute{'s' if minutes > 1 else ''}"
        formatted_duration.append(minute_str)

    return " and ".join(formatted_duration) if formatted_duration else "0 minutes"


def create_temporary_nfo(nfo: str) -> str:
    with NamedTemporaryFile(delete=False, suffix=".nfo", mode="w") as temp_file:
        temp_file.write(nfo)
        temp_path = temp_file.name
        file_id = str(uuid4())
        config.TEMPORARY_NFO[file_id] = {
            "path": temp_path,
            "expiration": time() + (15 * 60),
        }
        return f"{config.MTCC_ENDPOINT}/download-nfo?file_id={file_id}"


def convert_size(size_bytes: int) -> str:
    if size_bytes == 0:
        return "0B"
    size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {size_name[i]}"


def get_upload_infos(files: list[UploadFile]) -> dict[int, str]:
    total_size = 0
    for file in files:
        total_size += file.size
    return {
        "nb_files": len(files),
        "total_size": convert_size(total_size),
    }


def cleanup_temp_files() -> None:
    current_time = time()
    for file_id, file_info in config.TEMPORARY_NFO.items():
        if file_info.get("expiration") < current_time:
            os.remove(config.TEMPORARY_NFO[file_id].get("path"))
            del config.TEMPORARY_NFO[file_id]


def search_by_research(research: str) -> list[deezer.Album]:
    albums = []
    try:
        result = client.search(research)
        for data in result[:20]:
            album = data.get_album()
            if album.id not in [a.id for a in albums]:
                albums.append(album)
        return albums
    except Exception:
        return albums


def get_album(album_id: int) -> deezer.Album | None:
    try:
        return client.get_album(album_id)
    except Exception:
        return None


def search_by_album_performer(
    album_performer: str, album_title: str
) -> deezer.Album | None:
    album = None
    try:
        artists = client.search_artists(album_performer)
        for artist in artists[:10]:
            for album in artist.get_albums():
                if album_title == album.title:
                    return album
    except Exception:
        return None


def search_by_album(album_title) -> deezer.Album | None:
    try:
        albums = client.search_albums(album_title)
        for album in albums[:10]:
            if album_title == album.title:
                return album
    except Exception:
        return None

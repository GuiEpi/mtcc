from fastapi import FastAPI, File, UploadFile, HTTPException, Form, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from src.nfo import NfoBuilder
from src.pres import PresGenerator
import os
from typing import Annotated
import src.config as config
import src.libs.utils as utils
from src.libs.utils import InvalidMimeTypeError, FileSizeExceededError
import src.config as config
from src.models.banner import BannerModel
from src.models.torrent_content_response import (
    TorrentContentResponseWithoutPresModel,
    TorrentContentResponseModel,
)
from src.models.pres import SettingsModel, GetPresModel, PresContentResponseModel
from src.models.album import AlbumResponseModel
from typing import Union

logger = config.setup_logger(__name__)

app = FastAPI()

app.mount("/themes", StaticFiles(directory="themes"), name="themes")

origins = [
    "https://mtcc.guics.st",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

config.TEMPORARY_NFO = {}


@app.get("/api/themes")
async def get_banner_themes() -> list[str]:
    try:
        themes = []
        for theme in os.listdir("themes"):
            themes.append(theme)
        return themes
    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while accessing the themes directory",
        )


@app.get("/api/banners")
async def get_banners_link() -> dict[str, BannerModel]:
    try:
        banners = {}
        for root, dirs, files in os.walk("themes"):
            for dir_ in dirs:
                dir_path = os.path.join(root, dir_)
                display_name = dir_.split("_")
                display_name[-1] = f"({display_name[-1]})"
                display_name = " ".join(display_name)
                banners[dir_] = {
                    "displayName": str(display_name),
                    "banners": [
                        "{}/themes/{}/{}".format(config.MTCC_LINK, dir_, file)
                        for file in os.listdir(dir_path)
                        if os.path.isfile(os.path.join(dir_path, file))
                    ],
                }
        return banners
    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while accessing the banners directory",
        )


@app.get("/api/search")
async def search_album(
    album: str,
) -> Union[list[AlbumResponseModel], list]:
    try:
        response = []
        albums = utils.search_by_research(album)
        if albums:
            for album in albums:
                response.append(
                    AlbumResponseModel(
                        id=album.id,
                        title=album.title,
                        performer=album.artist.name,
                        nbTracks=len(album.tracks),
                        duration=utils.format_duration(album.duration),
                        cover=album.cover_medium,
                        releaseDate=album.release_date.strftime("%Y-%m-%d"),
                    )
                )
        return response
    except Exception as e:
        logger.error(f"An error occurred while searching for the album: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while searching for the album"
        )


@app.post("/api/pres")
async def get_pres(data: GetPresModel) -> PresContentResponseModel:
    try:
        album_id = data.id
        settings = data.settings
        album = utils.get_album(album_id)
        bits = utils.extract_bits(settings.codec)
        settings = SettingsModel(
            codec=settings.codec,
            frequency=settings.frequency,
            audio_bit_rate=str(settings.audioBitRate),
            bit_depth=str(bits),
            nb_files=str(settings.nbFiles),
            total_size=str(settings.totalSize),
            banner_theme=settings.bannerTheme,
            account_link=settings.accountLink,
            tag=settings.tag,
        )
        pres = PresGenerator(album=album, settings=settings)
        return PresContentResponseModel(torrentName=pres.torrent_name, pres=str(pres))
    except Exception as e:
        logger.error(f"An error occurred during pres generation: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred during pres generation."
        )


@app.post("/api/torrent")
async def get_torrent_content(
    files: Annotated[list[UploadFile], File(...)],
    ripper: Annotated[str, Form(...)] = "",
    uploader: Annotated[str, Form(...)] = "",
    bannerTheme: Annotated[str, Form(...)] = "",
    accountLink: Annotated[str, Form(...)] = "",
    tag: Annotated[str, Form(...)] = "",
    onlyNfo: Annotated[bool, Form(...)] = None,
) -> Union[TorrentContentResponseModel, TorrentContentResponseWithoutPresModel]:
    try:
        utils.validate_files(files)
        nfo = NfoBuilder(ripper=ripper, uploader=uploader)
        nfo.parse(files)
        nfo_download_link = utils.create_temporary_nfo(str(nfo))
        album_name = nfo.album
        album_performer = nfo.artist
        if onlyNfo:
            return TorrentContentResponseWithoutPresModel(
                nfoDownloadLink=nfo_download_link, nfo=str(nfo)
            )
        upload_infos = utils.get_upload_infos(files)
        album = utils.search_by_album(album_name) or utils.search_by_album_performer(
            album_performer, album_name
        )
        if album:
            upload_infos = utils.get_upload_infos(files)
            settings = SettingsModel(
                codec=str(nfo.pres_settings.codec),
                frequency=str(nfo.pres_settings.frequency),
                audio_bit_rate=str(nfo.pres_settings.audio_bit_rate),
                bit_depth=str(nfo.pres_settings.bit_depth),
                nb_files=str(upload_infos["nb_files"]),
                total_size=str(upload_infos["total_size"]),
                banner_theme=bannerTheme,
                account_link=accountLink,
                tag=tag,
            )
            pres = PresGenerator(album=album, settings=settings)
            response = TorrentContentResponseModel(
                nfoDownloadLink=nfo_download_link,
                torrentName=pres.torrent_name,
                pres=str(pres),
                nfo=str(nfo),
            )
            return response
    except InvalidMimeTypeError as e:
        raise HTTPException(status_code=400, detail=e.message)
    except FileSizeExceededError as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        logger.error(f"An error occurred during torrent content extraction: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during torrent content extraction.",
        )


@app.get("/api/download-nfo")
async def download_nfo(file_id: str, background_tasks: BackgroundTasks) -> FileResponse:
    try:
        filepath = config.TEMPORARY_NFO[file_id]["path"]
        filename = os.path.basename(filepath)
        headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
        background_tasks.add_task(utils.cleanup_temp_files)
        return FileResponse(filepath, headers=headers)
    except KeyError:
        logger.error(f"File not found or has expired: {file_id}")
        return Response(status_code=404, content="File not found or has expired")

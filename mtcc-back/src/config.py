from logging.handlers import RotatingFileHandler
import logging
from typing import Literal, Any

## mcc Nfo builder
NFO_BUILDER_NAME = "mtcc Nfo Builder"
NFO_BUILDER_VERSION = "0.1.0"

MTCC_LINK = "https://mtcc.guics.st"
MTCC_ENDPOINT = "https://mtcc.guics.st/api"

TEMPORARY_NFO = {}

ALLOWED_MIME_TYPES = {
    "audio/mpeg": 100 * 1024 * 1024,  # 100 MB
    "audio/flac": 100 * 1024 * 1024,  # 100 MB
    "audio/wav": 100 * 1024 * 1024,  # 100 MB
    "image/jpeg": 2 * 1024 * 1024,  # 2 MB
    "image/png": 2 * 1024 * 1024,  # 2 MB
}


# logging
def setup_logger(
    name: str,
    level: Literal[50, 40, 30, 20, 10] = logging.INFO,
    logbytes: int = 512000,
    logbackups: int = 3,
):
    formatter = logging.Formatter(
        "%(asctime)s %(module)9s:%(lineno)-7s %(levelname)-9s %(message)s"
    )

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)

    file_handler = RotatingFileHandler(
        "mtcc.log", mode="a", maxBytes=logbytes, backupCount=logbackups
    )
    file_handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(stream_handler)
    logger.addHandler(file_handler)

    return logger

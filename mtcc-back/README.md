# mtcc Backend
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black) 
[![Poetry](https://img.shields.io/endpoint?url=https://python-poetry.org/badge/v0.json)](https://python-poetry.org/)
![Python 3.11](https://img.shields.io/badge/python-3.11%20|%203.12-blue)

mtcc backend is the core of the application include a nfo builder and a pres generator.

## Requirements
mtcc backend recommends using [Poetry](https://python-poetry.org/) for a better development experience.

### MediaInfo
mtcc backend use [pymediainfo](https://pypi.org/project/pymediainfo/) is a simple wrapper around the MediaInfo library, which you can find at https://mediaarea.net/en/MediaInfo.
> * Without the library, this package cannot parse media files, which severely limits its functionality.
> * Binary wheels containing a bundled library version are provided for Windows and Mac OS X.
> * Packages are available for [several major Linux distributions](https://repology.org/project/python:pymediainfo/versions). They depend on the library most of the time and are the preferred way to use pymediainfo on Linux unless a specific version of the package is required.

### Installation
To install the necessary requirements, run the following command:
```bash
poetry install
```

## Running fastapi locally
To run FastAPI locally, use the following command:
```bash
poetry run uvicorn src.main:app --reload
```

## Built With

This project utilizes a number of powerful libraries and frameworks:

- [Poetry](https://python-poetry.org/): A tool for dependency management and packaging in Python.

- [deezer-python](https://github.com/browniebroke/deezer-python): A Python client for the Deezer API.

- [FastAPI](https://fastapi.tiangolo.com/): A modern, fast (high-performance), web framework for building APIs with Python 3.8+ based on standard Python type hints.

- [pymediainfo](https://pypi.org/project/pymediainfo/): A Python wrapper for the MediaInfo library, which is used for extracting detailed information about media files.

- [Mako](https://www.makotemplates.org/): A super-fast templating language that borrows the best ideas from the existing templating languages.

- [filetype](https://pypi.org/project/filetype/): A small package to infer file type and MIME type checking the magic numbers signature of a file or buffer.
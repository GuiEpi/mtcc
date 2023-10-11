import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pymediainfo import MediaInfo
import json
import tempfile
import os

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/album")
async def get_album():
    pass

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        with tempfile.TemporaryDirectory() as tmpdirname:
            file_location = os.path.join(tmpdirname, file.filename)
            with open(file_location, "wb") as buffer:
                buffer.write(file.file.read())
            
            media_info = MediaInfo.parse(file_location)

            for track in media_info.tracks:
                print(track.__dir__())
                if track.track_type == "Audio":
                    print(f"Bit rate: {track.bit_rate}, Channels: {track.channel_s}, Duration: {track.duration}, Format: {track.format}")
        
        return {"filename": file.filename, "detail": "File processed successfully"}
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return {"error": "An error occurred processing the file."}

@app.get("/")
async def root():
    return {"message": "Hello World"}

# def start():
#     """Launched with `poetry run start` at root level"""
#     uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)

package com.example.musicmanager.controller;

import com.example.musicmanager.model.Song;
import com.example.musicmanager.service.SongService;
import com.example.musicmanager.service.YouTubeSearchService;
import com.example.musicmanager.service.YouTubeSongResult;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/songs")
@CrossOrigin
public class SongController {

    private final SongService songService;
    private final YouTubeSearchService youTubeSearchService;

    public SongController(
            SongService songService,
            YouTubeSearchService youTubeSearchService) {

        this.songService = songService;
        this.youTubeSearchService = youTubeSearchService;
    }



    @GetMapping
    public List<Song> getAllSongs() {

        return songService.getAllSongs();
    }




    @PostMapping
    public ResponseEntity<?> addSong(
            @RequestBody Song song) {

        try {

            Song savedSong =
                    songService.addSong(song);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedSong);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }




    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeSong(
            @PathVariable Long id) {

        try {

            songService.removeSong(id);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Song removed successfully"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }




    @GetMapping("/artist/{artist}")
    public List<Song> getSongsByArtist(
            @PathVariable String artist) {

        return songService.getSongsByArtist(artist);
    }




    @GetMapping("/shuffle")
    public List<Song> shufflePlaylist() {

        return songService.shufflePlaylist();
    }




    @GetMapping("/youtube-search")
    public ResponseEntity<?> searchYouTubeSong(
            @RequestParam String title,
            @RequestParam String artist) {

        try {

            YouTubeSongResult result =
                    youTubeSearchService.searchVideo(
                            title,
                            artist
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "title",
                            title,

                            "artist",
                            artist,

                            "youtubeVideoId",
                            result.videoId(),

                            "duration",
                            result.duration()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }




    @PostMapping("/youtube-add")
    public ResponseEntity<?> addYouTubeSong(
            @RequestParam String title,
            @RequestParam String artist) {

        try {

            YouTubeSongResult result =
                    youTubeSearchService.searchVideo(
                            title,
                            artist
                    );

            Song song = new Song();

            song.setTitle(title);
            song.setArtist(artist);

            song.setDuration(
                    result.duration()
            );

            song.setYoutubeVideoId(
                    result.videoId()
            );

            song.setFavorite(false);

            Song savedSong =
                    songService.addSong(song);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedSong);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    @PutMapping("/{id}/favorite")
    public ResponseEntity<?> toggleFavorite(
            @PathVariable Long id) {

        try {

            Song song =
                    songService.toggleFavorite(id);

            return ResponseEntity.ok(song);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    @DeleteMapping("/clear")
    public ResponseEntity<?> clearPlaylist() {

        songService.clearPlaylist();

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Playlist cleared successfully"
                )
        );
    }
}
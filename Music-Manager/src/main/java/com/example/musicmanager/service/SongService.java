package com.example.musicmanager.service;

import com.example.musicmanager.model.Song;
import com.example.musicmanager.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class SongService {

    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }


    public Song addSong(Song song) {

        if (songRepository.existsByTitleIgnoreCaseAndArtistIgnoreCase(
                song.getTitle(),
                song.getArtist())) {

            throw new RuntimeException(
                    "Song already exists in the playlist"
            );
        }

        return songRepository.save(song);
    }


    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }


    public void removeSong(Long id) {

        if (!songRepository.existsById(id)) {
            throw new RuntimeException("Song not found");
        }

        songRepository.deleteById(id);
    }


    public List<Song> getSongsByArtist(String artist) {
        return songRepository.findByArtistIgnoreCase(artist);
    }


    public List<Song> shufflePlaylist() {

        List<Song> songs = songRepository.findAll();

        Collections.shuffle(songs);

        return songs;
    }


    public Song toggleFavorite(Long id) {

        Song song = songRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Song not found"));

        song.setFavorite(!song.isFavorite());

        return songRepository.save(song);
    }

    public void clearPlaylist() {
        songRepository.deleteAll();
    }
}
package com.example.musicmanager.repository;

import com.example.musicmanager.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    List<Song> findByArtistIgnoreCase(String artist);

    boolean existsByTitleIgnoreCaseAndArtistIgnoreCase(
            String title,
            String artist
    );
}
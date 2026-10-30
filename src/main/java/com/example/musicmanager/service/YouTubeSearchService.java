package com.example.musicmanager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
public class YouTubeSearchService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public YouTubeSongResult searchVideo(
            String title,
            String artist) {

        String query = title + " " + artist;

        String encodedQuery =
                URLEncoder.encode(
                        query,
                        StandardCharsets.UTF_8
                );

        String searchUrl =
                "https://www.googleapis.com/youtube/v3/search"
                + "?part=snippet"
                + "&q=" + encodedQuery
                + "&type=video"
                + "&videoEmbeddable=true"
                + "&maxResults=5"
                + "&key=" + apiKey;

        Map<?, ?> searchResponse =
                restTemplate.getForObject(
                        searchUrl,
                        Map.class
                );

        if (searchResponse == null) {
            throw new RuntimeException(
                    "Unable to search YouTube"
            );
        }

        List<?> items =
                (List<?>) searchResponse.get("items");

        if (items == null || items.isEmpty()) {
            throw new RuntimeException(
                    "Song not found on YouTube"
            );
        }

        Map<?, ?> firstItem =
                (Map<?, ?>) items.get(0);

        Map<?, ?> id =
                (Map<?, ?>) firstItem.get("id");

        if (id == null || id.get("videoId") == null) {
            throw new RuntimeException(
                    "No YouTube video found"
            );
        }

        String videoId =
                (String) id.get("videoId");



        String videoUrl =
                "https://www.googleapis.com/youtube/v3/videos"
                + "?part=contentDetails"
                + "&id=" + videoId
                + "&key=" + apiKey;

        Map<?, ?> videoResponse =
                restTemplate.getForObject(
                        videoUrl,
                        Map.class
                );

        if (videoResponse == null) {
            throw new RuntimeException(
                    "Unable to get YouTube video details"
            );
        }

        List<?> videoItems =
                (List<?>) videoResponse.get("items");

        if (videoItems == null || videoItems.isEmpty()) {
            throw new RuntimeException(
                    "Unable to get video duration"
            );
        }

        Map<?, ?> video =
                (Map<?, ?>) videoItems.get(0);

        Map<?, ?> contentDetails =
                (Map<?, ?>) video.get(
                        "contentDetails"
                );

        String isoDuration =
                (String) contentDetails.get(
                        "duration"
                );

        String duration =
                convertDuration(isoDuration);

        return new YouTubeSongResult(
                videoId,
                duration
        );
    }


    private String convertDuration(
            String isoDuration) {

        String duration =
                isoDuration.substring(2);

        int hours = 0;
        int minutes = 0;
        int seconds = 0;

        if (duration.contains("H")) {

            int hIndex =
                    duration.indexOf("H");

            hours = Integer.parseInt(
                    duration.substring(0, hIndex)
            );

            duration =
                    duration.substring(hIndex + 1);
        }

        if (duration.contains("M")) {

            int mIndex =
                    duration.indexOf("M");

            minutes = Integer.parseInt(
                    duration.substring(0, mIndex)
            );

            duration =
                    duration.substring(mIndex + 1);
        }

        if (duration.contains("S")) {

            int sIndex =
                    duration.indexOf("S");

            seconds = Integer.parseInt(
                    duration.substring(0, sIndex)
            );
        }

        if (hours > 0) {

            return String.format(
                    "%02d:%02d:%02d",
                    hours,
                    minutes,
                    seconds
            );
        }

        return String.format(
                "%02d:%02d",
                minutes,
                seconds
        );
    }
}
const API_URL = "/api/songs";

const songForm = document.getElementById("songForm");
const titleInput = document.getElementById("title");
const artistInput = document.getElementById("artist");
const message = document.getElementById("message");
const songTableBody = document.getElementById("songList");
const songCount = document.getElementById("songCount");
const playlistSearch = document.getElementById("playlistSearch");
const artistFilter = document.getElementById("artistFilter");
const filterBtn = document.getElementById("filterBtn");
const showAllBtn = document.getElementById("showAllBtn");
const favoritesBtn = document.getElementById("favoritesBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const clearPlaylistBtn = document.getElementById("clearPlaylistBtn");

const playerContainer =
    document.getElementById("playerContainer");

const youtubePlayerContainer =
    document.getElementById("youtubePlayer");

const nowPlayingTitle =
    document.getElementById("nowPlayingTitle");

const playBtn =
    document.getElementById("playBtn");

const pauseBtn =
    document.getElementById("pauseBtn");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");

const forwardBtn =
    document.getElementById("forwardBtn");

const progressBar =
    document.getElementById("progressBar");

const currentTime =
    document.getElementById("currentTime");

const totalTime =
    document.getElementById("totalTime");

const volumeBar =
    document.getElementById("volumeBar");

let allSongs = [];
let currentSongs = [];

let currentSongIndex = -1;

let player = null;
let youtubePlayerReady = false;

function showMessage(text, isError = false) {

    message.textContent = text;

    message.className =
        isError ? "error" : "success";
}

function onYouTubeIframeAPIReady() {

    console.log(
        "YouTube IFrame API loaded"
    );
}

function createYouTubePlayer(videoId) {

    playerContainer.style.display = "block";

    if (player) {

        player.loadVideoById(videoId);

        return;
    }

    player =
        new YT.Player(
            "youtubePlayer",
            {
                height: "0",
                width: "0",

                videoId: videoId,

                playerVars: {
                    autoplay: 1,
                    controls: 0
                },

                events: {

                    onReady: function (event) {

                        youtubePlayerReady =
                            true;

                        event.target.setVolume(
                            Number(
                                volumeBar.value
                            )
                        );

                        updateDuration();
                    },

                    onStateChange:
                        function (event) {

                            if (
                                event.data ===
                                YT.PlayerState.PLAYING
                            ) {

                                updateProgress();
                            }

                            if (
                                event.data ===
                                YT.PlayerState.ENDED
                            ) {

                                playNextSong();
                            }
                        }
                }
            }
        );
}

function playSong(
    videoId,
    title,
    artist,
    songId
) {

    if (!videoId) {

        showMessage(
            "No YouTube video is available for this song.",
            true
        );

        return;
    }

    currentSongIndex =
        allSongs.findIndex(
            song =>
                song.id ===
                Number(songId)
        );

    nowPlayingTitle.textContent =
        `🎵 ${title} — ${artist}`;

    playerContainer.style.display =
        "block";

    if (!player) {

        createYouTubePlayer(
            videoId
        );

    } else {

        player.loadVideoById(
            videoId
        );

        if (youtubePlayerReady) {

            player.playVideo();
        }
    }
}

previousBtn.addEventListener(
    "click",
    function () {

        if (
            !player ||
            !youtubePlayerReady ||
            allSongs.length === 0
        ) {

            return;
        }

        if (
            currentSongIndex <= 0
        ) {

            currentSongIndex =
                allSongs.length - 1;

        } else {

            currentSongIndex--;
        }

        const song =
            allSongs[
                currentSongIndex
            ];

        playSong(
            song.youtubeVideoId,
            song.title,
            song.artist,
            song.id
        );
    }
);

nextBtn.addEventListener(
    "click",
    function () {

        if (
            !player ||
            !youtubePlayerReady ||
            allSongs.length === 0
        ) {

            return;
        }

        playNextSong();
    }
);

function playNextSong() {

    if (
        allSongs.length === 0
    ) {

        return;
    }

    if (
        currentSongIndex >=
        allSongs.length - 1
    ) {

        currentSongIndex = 0;

    } else {

        currentSongIndex++;
    }

    const song =
        allSongs[
            currentSongIndex
        ];

    playSong(
        song.youtubeVideoId,
        song.title,
        song.artist,
        song.id
    );
}

playBtn.addEventListener(
    "click",
    function () {

        if (
            !player ||
            !youtubePlayerReady
        ) {

            return;
        }

        player.playVideo();
    }
);

pauseBtn.addEventListener(
    "click",
    function () {

        if (
            !player ||
            !youtubePlayerReady
        ) {

            return;
        }

        player.pauseVideo();
    }
);

backBtn.addEventListener(
    "click",
    function () {

        if (
            !player ||
            !youtubePlayerReady
        ) {

            return;
        }

        const current =
            player.getCurrentTime();

        player.seekTo(
            Math.max(
                current - 10,
                0
            ),
            true
        );
    }
);

forwardBtn.addEventListener(
    "click",
    function () {

        if (
            !player ||
            !youtubePlayerReady
        ) {

            return;
        }

        const current =
            player.getCurrentTime();

        const duration =
            player.getDuration();

        player.seekTo(
            Math.min(
                current + 10,
                duration
            ),
            true
        );
    }
);

progressBar.addEventListener(
    "input",
    function () {

        if (
            !player ||
            !youtubePlayerReady
        ) {

            return;
        }

        const duration =
            player.getDuration();

        const newTime =
            (
                Number(
                    this.value
                ) / 100
            ) * duration;

        player.seekTo(
            newTime,
            true
        );
    }
);

volumeBar.addEventListener(
    "input",
    function () {

        if (
            !player ||
            !youtubePlayerReady
        ) {

            return;
        }

        player.setVolume(
            Number(
                this.value
            )
        );
    }
);

function updateProgress() {

    if (
        !player ||
        !youtubePlayerReady
    ) {

        return;
    }

    const current =
        player.getCurrentTime();

    const duration =
        player.getDuration();

    if (!duration) {

        return;
    }

    const percentage =
        (
            current /
            duration
        ) * 100;

    progressBar.value =
        percentage;

    currentTime.textContent =
        formatTime(
            current
        );

    totalTime.textContent =
        formatTime(
            duration
        );

    if (
        player.getPlayerState() ===
        YT.PlayerState.PLAYING
    ) {

        requestAnimationFrame(
            updateProgress
        );
    }
}

function updateDuration() {

    if (
        !player ||
        !youtubePlayerReady
    ) {

        return;
    }

    const duration =
        player.getDuration();

    totalTime.textContent =
        formatTime(
            duration
        );

    updateProgress();
}

function formatTime(seconds) {

    seconds =
        Math.floor(
            seconds || 0
        );

    const minutes =
        Math.floor(
            seconds / 60
        );

    const remainingSeconds =
        seconds % 60;

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
}

songForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const title =
            titleInput.value.trim();

        const artist =
            artistInput.value.trim();

        if (
            !title ||
            !artist
        ) {

            showMessage(
                "Please enter song name and artist.",
                true
            );

            return;
        }

        try {

            showMessage(
                "Searching YouTube..."
            );

            const url =
                `${API_URL}/youtube-add`
                + `?title=${encodeURIComponent(title)}`
                + `&artist=${encodeURIComponent(artist)}`;

            const response =
                await fetch(
                    url,
                    {
                        method: "POST"
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Unable to add song"
                );
            }

            showMessage(
                `"${data.title}" added successfully!`
            );

            songForm.reset();

            await loadSongs();

        } catch (error) {

            showMessage(
                error.message,
                true
            );
        }
    }
);

async function loadSongs() {

    try {

        const response =
            await fetch(
                API_URL
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load playlist"
            );
        }

        const songs =
            await response.json();

        allSongs = songs;

        currentSongs = songs;

        displaySongs(
            songs
        );

    } catch (error) {

        console.error(
            "Load songs error:",
            error
        );

        showMessage(
            error.message,
            true
        );
    }
}

function displaySongs(songs) {

    currentSongs =
        songs;

    songCount.textContent =
        `${songs.length} ${
            songs.length === 1
                ? "song"
                : "songs"
        }`;

    songTableBody.innerHTML =
        "";

    if (
        songs.length === 0
    ) {

        songTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No songs found
                </td>
            </tr>
        `;

        return;
    }

    songs.forEach(
        song => {

            const row =
                document.createElement(
                    "tr"
                );

            const favoriteIcon =
                song.favorite
                    ? "❤️"
                    : "🤍";

            row.innerHTML = `

                <td>
                    ${song.id}
                </td>

                <td>
                    ${escapeHtml(
                        song.title
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        song.artist
                    )}
                </td>

                <td>
                    ${song.duration}
                </td>

                <td>

                    <button
                        class="play-btn"
                        onclick="playSong(
                            '${song.youtubeVideoId || ""}',
                            '${escapeHtml(song.title)}',
                            '${escapeHtml(song.artist)}',
                            '${song.id}'
                        )">

                        ▶ Play

                    </button>

                    <button
                        class="favorite-btn"
                        onclick="toggleFavorite(
                            ${song.id}
                        )">

                        ${favoriteIcon}

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteSong(
                            ${song.id}
                        )">

                        Delete

                    </button>

                </td>
            `;

            songTableBody.appendChild(
                row
            );
        }
    );
}

playlistSearch.addEventListener(
    "input",
    function () {

        const searchText =
            this.value
                .toLowerCase()
                .trim();

        if (
            searchText === ""
        ) {

            displaySongs(
                allSongs
            );

            return;
        }

        const filteredSongs =
            allSongs.filter(
                song => {

                    const title =
                        song.title
                            .toLowerCase();

                    const artist =
                        song.artist
                            .toLowerCase();

                    return (
                        title.includes(
                            searchText
                        ) ||
                        artist.includes(
                            searchText
                        )
                    );
                }
            );

        displaySongs(
            filteredSongs
        );
    }
);

async function deleteSong(id) {

    if (
        !confirm(
            "Are you sure you want to delete this song?"
        )
    ) {

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to delete song"
            );
        }

        if (
            currentSongIndex !== -1
        ) {

            const deletedIndex =
                allSongs.findIndex(
                    song =>
                        song.id === id
                );

            if (
                deletedIndex ===
                currentSongIndex
            ) {

                currentSongIndex =
                    -1;

                if (player) {

                    player.stopVideo();
                }
            }
        }

        showMessage(
            "Song removed successfully!"
        );

        await loadSongs();

    } catch (error) {

        showMessage(
            error.message,
            true
        );
    }
}

async function toggleFavorite(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}/favorite`,
                {
                    method: "PUT"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to update favorite"
            );
        }

        await loadSongs();

    } catch (error) {

        showMessage(
            error.message,
            true
        );
    }
}

filterBtn.addEventListener(
    "click",
    async function () {

        const artist =
            artistFilter.value.trim();

        if (!artist) {

            showMessage(
                "Enter an artist name.",
                true
            );

            return;
        }

        try {

            const response =
                await fetch(
                    `${API_URL}/artist/${encodeURIComponent(
                        artist
                    )}`
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to filter songs"
                );
            }

            const songs =
                await response.json();

            displaySongs(
                songs
            );

        } catch (error) {

            showMessage(
                error.message,
                true
            );
        }
    }
);

showAllBtn.addEventListener(
    "click",
    function () {

        artistFilter.value =
            "";

        playlistSearch.value =
            "";

        displaySongs(
            allSongs
        );
    }
);

favoritesBtn.addEventListener(
    "click",
    function () {

        const favorites =
            allSongs.filter(
                song =>
                    song.favorite
            );

        displaySongs(
            favorites
        );
    }
);

shuffleBtn.addEventListener(
    "click",
    async function () {

        try {

            const response =
                await fetch(
                    `${API_URL}/shuffle`
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to shuffle playlist"
                );
            }

            const songs =
                await response.json();

            displaySongs(
                songs
            );

        } catch (error) {

            showMessage(
                error.message,
                true
            );
        }
    }
);

clearPlaylistBtn.addEventListener(
    "click",
    async function () {

        if (
            !confirm(
                "Are you sure you want to clear the entire playlist?"
            )
        ) {

            return;
        }

        try {

            const response =
                await fetch(
                    `${API_URL}/clear`,
                    {
                        method: "DELETE"
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Unable to clear playlist"
                );
            }

            if (player) {

                player.stopVideo();
            }

            currentSongIndex =
                -1;

            playerContainer.style.display =
                "none";

            showMessage(
                "Playlist cleared successfully!"
            );

            await loadSongs();

        } catch (error) {

            showMessage(
                error.message,
                true
            );
        }
    }
);

function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}

loadSongs();
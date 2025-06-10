// Function to handle image click and show video popup
const setupvideoBox = () => {
  document.body.addEventListener('click', (event) => {
    const img = event.target.closest('img[link]');
    if (!img) return; // Ignore clicks outside of images with the 'link' attribute

    const videoUrl = img.getAttribute('link');
    const audioUrl = img.getAttribute('audio'); // Get audio attribute
    const videoTitle = img.nextElementSibling?.textContent || 'Untitled Video'; // Get title from <p> tag
    const poster = img.getAttribute('saver') || img.src; // Use the image source as the poster
    const trailer = img.getAttribute('trailer'); // Get trailer attribute

    if (videoUrl) {
      const urls = videoUrl.split(',').map((url) => url.trim()); // Split and trim video URLs
      const audioSrc = audioUrl ? audioUrl.split(',').map((url) => url.trim()) : []; // Split and trim audio URLs
      let currentIndex = 0; // Track the current URL index

      // Create preview page
      const previewShow = () => {
        const originalTitle = document.title; // Save current page title
        document.title = videoTitle; // Set page title to videoTitle

        // Prevent background scroll
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const previewPAge = document.createElement('div');
        previewPAge.style.position = 'fixed';
        previewPAge.style.top = '0';
        previewPAge.style.left = '0';
        previewPAge.style.width = '100vw';
        previewPAge.style.height = '100vh';
        previewPAge.style.backgroundColor = 'rgba(0, 0, 0, 0.51)';
        previewPAge.style.backdropFilter = 'blur(18px)';
        previewPAge.style.color = 'white';
        previewPAge.style.zIndex = '11000';
        previewPAge.style.overflowY = 'auto';
        // --- Slide in animation ---
        previewPAge.style.transform = 'translateX(100vw)';
        previewPAge.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
        setTimeout(() => {
          previewPAge.style.transform = 'translateX(0)';
        }, 10);

        // Add poster image
        const posterImg = document.createElement('video');
        posterImg.style.display = 'block';
        posterImg.style.background = 'black';
        posterImg.style.marginLeft = '0';
        posterImg.style.marginTop = '0';
        posterImg.style.boxShadow = 'grey 0.2em 0.2em 0.5em';
        posterImg.style.width = '100%';
        posterImg.style.height = '13em';
        posterImg.style.objectFit = 'cover';
        posterImg.src = trailer;
        posterImg.poster = poster; 
        posterImg.controls = false; // Remove default controls
        posterImg.autoplay = true;
        posterImg.muted = true;
        posterImg.addEventListener('click', () => {
          if (posterImg.muted) {
            posterImg.muted= false;
          } else {
            posterImg.muted = true;
          }
        });
        previewPAge.appendChild(posterImg);

        // Add title
        const title = document.createElement('p');
        title.textContent = videoTitle;
        title.style.textAlign = 'left';
        title.style.fontSize = '20px';
        title.style.marginTop = '0.5em';
        title.style.color = 'white';
        title.style.marginLeft = '1em';
        title.style.width = '80%';
        previewPAge.appendChild(title);

        // Add play button
        const playButton = document.createElement('button');
        // Check if there is saved progress for the first video URL
        let savedData = {};
        try {
          savedData = JSON.parse(localStorage.getItem('videoProgress')) || {};
        } catch (e) {
          savedData = {};
        }
        const firstVideoSrc = urls[0];
        if (savedData[firstVideoSrc] && savedData[firstVideoSrc].progress > 0) {
          playButton.textContent = 'Resume';
        } else {
          playButton.textContent = 'Play';
        }
        playButton.style.display = 'block';
        playButton.style.marginTop = '0.7em';
        playButton.style.marginLeft = '5%';
        playButton.style.width = '90%';
        playButton.style.padding = '1em 2em';
        playButton.style.borderRadius = '1em';
        playButton.style.backgroundColor = 'white';
        playButton.style.color = 'black';
        playButton.style.fontWeight= 'bolder';
        playButton.style.border = 'none';
        playButton.style.cursor = 'pointer';
        playButton.addEventListener('click', () => {
          posterImg.pause();
          videoShow(currentIndex); // Show video popup
        });
        previewPAge.appendChild(playButton);

        // Add wishlist button
        const wishlistButton = document.createElement('button');
        wishlistButton.textContent = 'Add to Wishlist';
        wishlistButton.style.display = 'block';
        wishlistButton.style.marginTop = '0.7em';
        wishlistButton.style.marginLeft = '5%';
        wishlistButton.style.width = '90%';
        wishlistButton.style.padding = '1em 2em';
        wishlistButton.style.borderRadius = '1em';
        wishlistButton.style.backgroundColor = '#ffcc00';
        wishlistButton.style.color = 'black';
        wishlistButton.style.fontWeight = 'bolder';
        wishlistButton.style.border = 'none';
        wishlistButton.style.cursor = 'pointer';
        wishlistButton.addEventListener('click', () => {
          const parentDiv = img.closest('div'); // Get the parent div of the clicked image
          if (!parentDiv) return;

          const watchlistDiv = document.querySelector('.watchlist');
          if (watchlistDiv) {
            // Check if the same element already exists in the watchlist
            const existingItems = Array.from(watchlistDiv.children);
            const isDuplicate = existingItems.some((item) => item.isEqualNode(parentDiv));
            wishlistButton.textContent= 'Already Added';

            if (!isDuplicate) {
              const clonedDiv = parentDiv.cloneNode(true); // Clone the parent div with its children
              clonedDiv.querySelectorAll('button').forEach((btn) => btn.remove()); // Remove buttons from the cloned div
              watchlistDiv.appendChild(clonedDiv); // Append the cloned div to the .watchlist div
              wishlistButton.style.backgroundColor = 'green';
              wishlistButton.textContent = 'Added';

              // Save to localStorage
              const watchlistHTML = watchlistDiv.innerHTML;
              localStorage.setItem('watchlist', watchlistHTML);
            }
          }
        });
        previewPAge.appendChild(wishlistButton);

        // --- Add redirect button if img.alt has a value ---
        if (img.alt && img.alt.trim() !== '') {
          const downloadButton = document.createElement('button');
          downloadButton.textContent = 'Download';
          downloadButton.style.display = 'block';
          downloadButton.style.marginTop = '0.7em';
          downloadButton.style.marginLeft = '5%';
          downloadButton.style.width = '90%';
          downloadButton.style.padding = '1em 2em';
          downloadButton.style.borderRadius = '1em';
          downloadButton.style.backgroundColor = '#007bff';
          downloadButton.style.color = 'white';
          downloadButton.style.fontWeight = 'bolder';
          downloadButton.style.border = 'none';
          downloadButton.style.cursor = 'pointer';
          downloadButton.addEventListener('click', () => {
            downloadButton.style.backgroundColor = 'green';
            downloadButton.textContent = 'Downloading...';
            window.location.href = img.alt; // Redirect to the download link
          });
          previewPAge.appendChild(downloadButton);
        }
        
        const description = document.createElement('p');
        description.textContent = img.title || videoTitle;
        description.className = 'description';
        description.style.marginTop = '20px';
        description.style.marginLeft = '3%';
        description.style.padding = '10px';
        description.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        description.style.borderRadius = '10px';
        description.style.color = 'white';
        description.style.fontSize = '14px';
        description.style.width = '90%';
        previewPAge.appendChild(description);

        // Load wishlist from localStorage on page load
        document.addEventListener('DOMContentLoaded', () => {
          const watchlistDiv = document.querySelector('.watchlist');
          if (watchlistDiv) {
            const savedWatchlist = localStorage.getItem('watchlist');
            if (savedWatchlist) {
              watchlistDiv.innerHTML = savedWatchlist;
            }
          }
        });

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.position = 'fixed';
        closeButton.style.top = '2.5em';
        closeButton.style.right = '1em';
        closeButton.style.padding = '10px';
        closeButton.style.borderRadius = '1em';
        closeButton.style.backgroundColor = 'red';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
          document.body.removeChild(previewPAge); // Remove preview page
          document.title = originalTitle;
          window.removeEventListener('popstate', handlePopState);
          // Restore background scroll
          document.body.style.overflow = previousOverflow;
          // Go forward in history if the state was just added
          if (history.state && history.state.previewOpen) {
            history.back();
          }
        });
        previewPAge.appendChild(closeButton);

        // --- Add history state and popstate handler for back navigation ---
        history.pushState({ previewOpen: true }, '');
        const handlePopState = (event) => {
          if (document.body.contains(previewPAge)) {
            closeButton.click();
          }
        };
        window.addEventListener('popstate', handlePopState);

        // Add random grid view
        const addRandomGridView = (previewPage) => {
          const allInnerDivs = Array.from(document.querySelectorAll('.box div')); // Select all inner divs of .box
          const randomInnerDivs = allInnerDivs
            .sort(() => 0.5 - Math.random()) // Shuffle the array
            .slice(0, 6); // Take 6 random inner divs

          const gridContainer = document.createElement('div');
          gridContainer.style.display = 'grid';
          gridContainer.style.gridTemplateColumns = '1fr 1fr 1fr'; // 3 columns
          gridContainer.style.gap = '10px'; // Add spacing between boxes
          gridContainer.style.margin = '1em';
          gridContainer.style.width = '90%';
          gridContainer.style.marginLeft = '5%';
          gridContainer.style.marginBottom= '3em';

          randomInnerDivs.forEach((innerDiv) => {
            const clonedInnerDiv = innerDiv.cloneNode(true); // Clone the inner div element with its children
            clonedInnerDiv.style.position = 'relative';
            clonedInnerDiv.style.overflow = 'hidden';
            clonedInnerDiv.style.borderRadius = '0.5em';
            clonedInnerDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            clonedInnerDiv.style.backgroundColor = '#000';

            // Hide all child elements except <img>
            Array.from(clonedInnerDiv.children).forEach((child) => {
              if (child.tagName !== 'IMG') {
                child.style.display = 'none';
              } else {
                child.style.width = '100%';
                child.style.height = '10em';
                child.style.objectFit = 'cover';
                child.style.borderRadius = '0.5em';
              }
            });

            // Add click event to open new preview and close the current one
            clonedInnerDiv.addEventListener('click', () => {
              document.body.removeChild(previewPage); // Close the current preview page
              const slotValue = clonedInnerDiv.getAttribute('slot'); // Get slot value if available
              if (slotValue) {
                const matchingVideos = netflee.filter((item) => item.slot === slotValue);
                if (matchingVideos.length > 0) {
                  currentSeasonIndex = 0; // Reset to the first season
                  currentIndex = 0; // Reset to the first video/audio URL
                  videoLinks = matchingVideos[currentSeasonIndex].link;
                  audioLinks = matchingVideos[currentSeasonIndex].audio;
                  createPreviewPage(); // Open a new preview page
                }
              }
            });

            gridContainer.appendChild(clonedInnerDiv);
          });

          previewPage.appendChild(gridContainer);
        };

        addRandomGridView(previewPAge); // Add random grid view

        document.body.appendChild(previewPAge);
      };

      previewShow(); // Show the preview page

      const videoShow = (index) => {
        const videoSrc = urls[index];
        const currentAudioSrc = audioSrc[index]; // Rename to avoid conflict
        if (!videoSrc) return;

        // Create video popup container
        const videoBox = document.createElement('div');
        videoBox.style.position = 'fixed';
        videoBox.setAttribute('class', 'video-Popup');
        videoBox.style.top = '0';
        videoBox.style.left = '0';
        videoBox.style.width = '100%';
        videoBox.style.height = '100%';
        videoBox.style.backgroundColor = 'rgb(0, 0, 0)';
        videoBox.style.display = 'flex';
        videoBox.style.justifyContent = 'center';
        videoBox.style.alignItems = 'center';
        videoBox.style.zIndex = '12000';
        videoBox.style.transform = 'rotate(0deg)'; // Default orientation

        // Force landscape orientation when fullscreen
        const enforceLandscape = () => {
          if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
          ) {
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation.lock('landscape').catch((err) => {
                console.warn('Failed to lock orientation:', err);
              });
            } else {
              videoBox.style.transform = 'rotate(90deg)';
              videoBox.style.transformOrigin = 'center';
            }
          } else {
            videoBox.style.transform = 'rotate(0deg)';
          }
        };

        document.addEventListener('fullscreenchange', enforceLandscape);
        document.addEventListener('webkitfullscreenchange', enforceLandscape);
        document.addEventListener('mozfullscreenchange', enforceLandscape);
        document.addEventListener('MSFullscreenChange', enforceLandscape);

        // Create video element
        const video = document.createElement('video');
        video.src = videoSrc;
        video.preload = 'auto'; // Hint browser to preload for quick start
        video.load(); // Start loading immediately
        video.controls = false; // Remove default controls
        video.autoplay = true;
        video.muted = false;
        video.style.width = '100%';
        video.style.height = '100%';
        video.poster = 'image/poster.png'; // Placeholder image
        video.style.margin = '0';
        video.style.position = 'relative';

        // Create audio element
        const audio = document.createElement('audio');
        if (currentAudioSrc) { // Use renamed variable
          audio.src = currentAudioSrc;
          audio.preload = 'auto'; // Hint browser to preload audio
          audio.load();
          audio.autoplay = true;
          audio.muted = false; // Ensure audio is not muted by default
          audio.controls = false;
          audio.style.display = 'none'; // Hide audio element
          videoBox.appendChild(audio);

          // Sync audio with video
          video.addEventListener('play', () => audio.play());
          video.addEventListener('pause', () => audio.pause());
          video.addEventListener('seeked', () => (audio.currentTime = video.currentTime));
          video.addEventListener('timeupdate', () => {
            if (Math.abs(video.currentTime - audio.currentTime) > 0.3) {
              audio.currentTime = video.currentTime; // Resync if out of sync
            }
          });
        }

        // Resume video from last saved progress if source matches
        const savedData = JSON.parse(localStorage.getItem('videoProgress')) || {};
        if (savedData[videoSrc] && savedData[videoSrc].progress !== undefined) {
          video.currentTime = savedData[videoSrc].progress;
        }

        // Save video progress to local storage
        const saveProgress = () => {
          if (!isNaN(video.currentTime) && video.duration > 0) {
            const updatedData = JSON.parse(localStorage.getItem('videoProgress')) || {};
            updatedData[video.src] = { progress: video.currentTime };
            localStorage.setItem('videoProgress', JSON.stringify(updatedData));
          }
        };

        // Function to resume video from saved progress
        const resumeFromSavedProgress = () => {
          const savedData = JSON.parse(localStorage.getItem('videoProgress')) || {};
          if (savedData[video.src] && savedData[video.src].progress !== undefined) {
            video.currentTime = savedData[video.src].progress;
          }
        };

        video.addEventListener('timeupdate', saveProgress);
        video.addEventListener('ended', () => {
          const updatedData = JSON.parse(localStorage.getItem('videoProgress')) || {};
          delete updatedData[video.src]; // Remove progress for the ended video
          localStorage.setItem('videoProgress', JSON.stringify(updatedData));
        });

        // Add title on top-left of the video
        const title = document.createElement('div');
        title.textContent = videoTitle;
        title.style.position = 'absolute';
        title.style.top = '1em';
        title.style.left = '1em';
        title.style.color = 'white';
        title.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)'; // Add text shadow for better visibility
        title.style.fontSize = '18px';
        title.style.fontWeight = 'bold';
        title.style.zIndex = '15';
        videoBox.appendChild(title);

        // Add timeline on bottom-left
        const timeline = document.createElement('div');
        timeline.style.position = 'absolute';
        timeline.style.bottom = '2.5em';
        timeline.style.left = '2.2em';
        timeline.style.color = 'white';
        timeline.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)'; // Add text shadow for better visibility
        timeline.style.fontSize = '14px';
        timeline.style.fontWeight = 'bold';
        timeline.style.zIndex = '15';
        timeline.textContent = '00:00 / 00:00';

        const formatTime = (time) => {
          const hours = Math.floor(time / 3600).toString().padStart(2, '0');
          const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
          const seconds = Math.floor(time % 60).toString().padStart(2, '0');
          return `${hours}:${minutes}:${seconds}`;
        };

        video.addEventListener('timeupdate', () => {
          const currentTime = formatTime(video.currentTime);
          const duration = formatTime(video.duration || 0);
          timeline.textContent = `${currentTime} / ${duration}`;
        });

        videoBox.appendChild(timeline);

        // Create custom controls container
        const controls = document.createElement('div');
        controls.style.position = 'absolute';
        controls.style.bottom = '10px';
        controls.style.width = '100%';
        controls.style.display = 'flex';
        controls.style.flexDirection = 'column';
        controls.style.alignItems = 'center';
        controls.style.zIndex = '10';

        // Add progress bar
        const progressBar = document.createElement('input');
        progressBar.type = 'range';
        progressBar.min = '0';
        progressBar.max = '100';
        progressBar.style.height = '0.2em';
        progressBar.value = '0';
        progressBar.style.width = '90%';
        progressBar.style.filter = 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.75))'; // Add shadow for better visibility
        progressBar.style.marginBottom = '4em';
        progressBar.addEventListener('input', () => {
          video.currentTime = (progressBar.value / 100) * video.duration;
        });
        video.addEventListener('timeupdate', () => {
          progressBar.value = (video.currentTime / video.duration) * 100;
        });
        controls.appendChild(progressBar);

        // Create inline controls container
        const inlineControls = document.createElement('div');
        inlineControls.style.position = 'absolute';
        inlineControls.style.top = '50%';
        inlineControls.style.left = '50%';
        inlineControls.style.transform = 'translate(-50%, -50%)';
        inlineControls.style.display = 'flex';
        inlineControls.style.alignItems = 'center';
        inlineControls.style.zIndex = '20';

        // Add 10-second back button
        const backButton = document.createElement('button');
        backButton.innerHTML = '<i class="fi fi-rr-replay-10" style="font-size:2em;"></i>';
        backButton.style.marginRight = '2em';
        backButton.style.padding = '10px';
        backButton.style.backgroundColor = 'transparent';
        backButton.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)'; // Add text shadow for better visibility
        backButton.style.color = 'white';
        backButton.style.border = 'none';
        backButton.style.cursor = 'pointer';
        backButton.addEventListener('click', () => {
          video.currentTime = Math.max(0, video.currentTime - 10);
        });
        inlineControls.appendChild(backButton);

        // Add play/pause button
        const playPauseButton = document.createElement('button');
        playPauseButton.innerHTML = '<i class="fi fi-sr-pause" style="color:white;font-size:3.5em;"></i>';
        playPauseButton.style.margin = '5px';
        playPauseButton.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)'; // Add text shadow for better visibility
        playPauseButton.style.color = 'white';
        playPauseButton.style.padding = '2em';
        playPauseButton.style.backgroundColor = 'transparent';
        playPauseButton.style.border = 'none';
        playPauseButton.style.cursor = 'pointer';
        playPauseButton.addEventListener('click', () => {
          if (video.paused) {
            video.play();
            playPauseButton.innerHTML = '<i class="fi fi-sr-pause" style="color:white;font-size:3.5em;"></i>';
          } else {
            video.pause();
            playPauseButton.innerHTML = '<i class="fi fi-sr-play" style="color:white;font-size:3.5em;"></i>';
          }
        });
        inlineControls.appendChild(playPauseButton);

        // Add 10-second forward button
        const forwardButton = document.createElement('button');
        forwardButton.innerHTML = '<i class="fi fi-rr-time-forward-ten" style="font-size:2em;"></i>';
        forwardButton.style.marginLeft = '2em';
        forwardButton.style.padding = '10px';
        forwardButton.style.backgroundColor = 'transparent';
        forwardButton.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)'; // Add text shadow for better visibility
        forwardButton.style.color = 'white';
        forwardButton.style.border = 'none';
        forwardButton.style.cursor = 'pointer';
        forwardButton.addEventListener('click', () => {
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
        });
        inlineControls.appendChild(forwardButton);

        // Add Previous button on middle-left
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '<i class="fi fi-rr-angle-left" style="font-size:2em;"></i>';
        prevButton.style.position = 'absolute';
        prevButton.style.top = '50%';
        prevButton.style.left = '2em';
        prevButton.style.transform = 'translateY(-50%)';
        prevButton.style.padding = '10px';
        prevButton.style.backgroundColor = 'transparent';
        prevButton.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)'; // Add text shadow for better visibility
        prevButton.style.color = 'white';
        prevButton.style.border = 'none';
        prevButton.style.cursor = 'pointer';
        prevButton.style.zIndex = '20';
        prevButton.addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex--;
            updateMediaSource(urls[currentIndex], audioSrc[currentIndex]);
            title.textContent = `${videoTitle} - Episode ${currentIndex + 1}`; // Update title with episode number
          }
        });
        videoBox.appendChild(prevButton);

        // Add Next button on middle-right
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<i class="fi fi-rr-angle-right" style="font-size:2em;"></i>';
        nextButton.style.position = 'absolute';
        nextButton.style.top = '50%';
        nextButton.style.right = '2em';
        nextButton.style.transform = 'translateY(-50%)';
        nextButton.style.padding = '10px';
        nextButton.style.backgroundColor = 'transparent';
        nextButton.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)'; // Add text shadow for better visibility
        nextButton.style.color = 'white';
        nextButton.style.border = 'none';
        nextButton.style.cursor = 'pointer';
        nextButton.style.zIndex = '20';
        nextButton.addEventListener('click', () => {
          if (currentIndex < urls.length - 1) {
            currentIndex++;
            updateMediaSource(urls[currentIndex], audioSrc[currentIndex]);
            title.textContent = `${videoTitle} - Episode ${currentIndex + 1}`; // Update title with episode number
          } else {
            nextButton.innerHTML = ''; // Remove inner HTML if no next video source
          }
        });
        videoBox.appendChild(nextButton);

        // Remove innerHTML of Next and Previous buttons if only one video source exists
        if (urls.length === 1) {
          prevButton.innerHTML = '';
          nextButton.innerHTML = '';
        }

        // Update video and audio source on next/previous button click
        const updateMediaSource = (newVideoSrc, newAudioSrc) => {
          video.pause();
          video.src = newVideoSrc;
          video.load();
          if (currentAudioSrc) { // Use renamed variable
            audio.pause();
            audio.src = newAudioSrc || '';
            audio.load();
          }
          resumeFromSavedProgress();
          video.play();
        };

        // Append inline controls and video to popup
        videoBox.appendChild(video);
        videoBox.appendChild(inlineControls);
        videoBox.appendChild(controls);
        document.body.appendChild(videoBox);

        // Create loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="4.5em" height="4.5em" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 4.03 9 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>';
        loadingIndicator.style.position = 'absolute';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.color = 'white';
        loadingIndicator.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)';
        loadingIndicator.style.fontFamily = 'Arial, sans-serif';
        loadingIndicator.style.fontSize = '20px';
        loadingIndicator.style.fontWeight = 'bold';
        loadingIndicator.style.zIndex = '25';
        loadingIndicator.style.display = 'none'; // Initially hidden
        videoBox.appendChild(loadingIndicator);

        const showLoading = () => {
          loadingIndicator.style.display = 'block';
          title.style.display = 'none';
          timeline.style.display = 'none';
          controls.style.display = 'none';
          inlineControls.style.display = 'none';
          prevButton.style.display = 'none';
          nextButton.style.display = 'none';
          if (audioSrc) {
            audio.pause(); // Pause audio immediately when loading indicator is shown
          }
        };

        const hideLoading = () => {
          loadingIndicator.style.display = 'none';
          showControls(); // Show controls when loading is complete
          if (audioSrc && !video.paused) {
            audio.play(); // Resume audio if video is playing
          }
        };

        // Show loading indicator when video is loading or not started
        video.addEventListener('waiting', showLoading);
        video.addEventListener('canplay', hideLoading);
        video.addEventListener('canplaythrough', hideLoading);

        // Ensure loading indicator is shown initially if the video hasn't started
        if (video.readyState < 3) {
          showLoading();
        }

        // Request fullscreen for the entire popup
        if (videoBox.requestFullscreen) {
          videoBox.requestFullscreen();
        } else if (videoBox.webkitRequestFullscreen) {
          videoBox.webkitRequestFullscreen();
        } else if (videoBox.mozRequestFullScreen) {
          videoBox.mozRequestFullScreen();
        } else if (videoBox.msRequestFullscreen) {
          videoBox.msRequestFullscreen();
        }

        // Handle exit fullscreen
        const onFullscreenChange = () => {
          if (
            !document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement
          ) {
            video.pause();
            video.src = ''; // Clear video source
            if (document.body.contains(videoBox)) {
              document.body.removeChild(videoBox); // Ensure popup is removed
            }
            document.removeEventListener('fullscreenchange', onFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
            document.removeEventListener('mozfullscreenchange', onFullscreenChange);
            document.removeEventListener('MSFullscreenChange', onFullscreenChange);
          }
        };

        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);
        document.addEventListener('mozfullscreenchange', onFullscreenChange);
        document.addEventListener('MSFullscreenChange', onFullscreenChange);

        // Add exit fullscreen button on top-right
        const exitFullscreenButton = document.createElement('button');
        exitFullscreenButton.innerHTML = '<i class="fi fi-rr-cross" style="font-size:2em;"></i>';
        exitFullscreenButton.style.position = 'absolute';
        exitFullscreenButton.style.top = '1em';
        exitFullscreenButton.style.right = '1em';
        exitFullscreenButton.style.padding = '10px';
        exitFullscreenButton.style.backgroundColor = 'transparent';
        exitFullscreenButton.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.95)'; // Add text shadow for better visibility
        exitFullscreenButton.style.color = 'white';
        exitFullscreenButton.style.border = 'none';
        exitFullscreenButton.style.cursor = 'pointer';
        exitFullscreenButton.style.zIndex = '20';
        exitFullscreenButton.addEventListener('click', () => {
          // Always remove videoBox from DOM, regardless of fullscreen API
          if (document.body.contains(videoBox)) {
            document.body.removeChild(videoBox);
          }
          // Try to exit fullscreen if possible
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        });
        videoBox.appendChild(exitFullscreenButton);

        // Hide controls after 2 seconds of inactivity
        let hideControlsTimeout;

        const hideControls = () => {
          if (!video.paused) { // Do not hide controls if the video is paused
            title.style.display = 'none';
            timeline.style.display = 'none';
            controls.style.display = 'none';
            inlineControls.style.display = 'none';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            exitFullscreenButton.style.display = 'none'; // Hide exit fullscreen button
          }
        };

        const showControls = () => {
          title.style.display = 'block';
          timeline.style.display = 'block';
          controls.style.display = 'flex';
          inlineControls.style.display = 'flex';
          prevButton.style.display = 'block';
          nextButton.style.display = 'block';
          exitFullscreenButton.style.display = 'block'; // Show exit fullscreen button
          resetHideControlsTimeout();
        };

        const resetHideControlsTimeout = () => {
          clearTimeout(hideControlsTimeout);
          hideControlsTimeout = setTimeout(hideControls, 2000);
        };

        // Attach event listeners to show controls on interaction
        videoBox.addEventListener('mousemove', showControls);
        videoBox.addEventListener('click', showControls);

        // Start the timeout to hide controls
        resetHideControlsTimeout();

        video.addEventListener('pause', () => {
          showControls(); // Show controls when the video is paused
          clearTimeout(hideControlsTimeout); // Clear the timeout to prevent hiding
        });

        video.addEventListener('play', () => {
          resetHideControlsTimeout(); // Restart the timeout when the video plays
        });

        // Add double-click functionality for back and forward
        videoBox.addEventListener('dblclick', (event) => {
          const rect = video.getBoundingClientRect();
          const clickX = event.clientX - rect.left;

          if (clickX < rect.width / 2) {
            // Double-click on the left side triggers back button
            backButton.click();
          } else {
            // Double-click on the right side triggers forward button
            forwardButton.click();
          }
        });

        // Add pinch-to-zoom functionality
        let initialPinchDistance = null;
        let isFitMode = false; // Track fit mode state

        const calculateDistance = (touch1, touch2) => {
          const dx = touch1.clientX - touch2.clientX;
          const dy = touch1.clientY - touch2.clientY;
          return Math.sqrt(dx * dx + dy * dy);
        };

        const handlePinchStart = (event) => {
          if (event.touches.length === 2) {
            initialPinchDistance = calculateDistance(event.touches[0], event.touches[1]);
          }
        };

        const handlePinchMove = (event) => {
          if (event.touches.length === 2 && initialPinchDistance !== null) {
            const currentPinchDistance = calculateDistance(event.touches[0], event.touches[1]);

            if (currentPinchDistance > initialPinchDistance * 1.2) {
              // Pinch out (zoom in)
              if (!isFitMode) {
                video.style.objectFit = 'cover'; // Fit mode
                isFitMode = true;
              }
              initialPinchDistance = currentPinchDistance; // Update pinch distance
            } else if (currentPinchDistance < initialPinchDistance * 0.8) {
              // Pinch in (zoom out)
              if (isFitMode) {
                video.style.objectFit = 'contain'; // Default mode
                isFitMode = false;
              }
              initialPinchDistance = currentPinchDistance; // Update pinch distance
            }
          }
        };

        const handlePinchEnd = () => {
          initialPinchDistance = null; // Reset pinch distance on touch end
        };

        video.addEventListener('touchstart', handlePinchStart);
        video.addEventListener('touchmove', handlePinchMove);
        video.addEventListener('touchend', handlePinchEnd);
        video.addEventListener('touchcancel', handlePinchEnd);
      };

      // Do not call videoShow here; only call it from the play button click event
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  setupvideoBox();
});
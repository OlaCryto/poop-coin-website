// Enhanced Memes Upload Functionality with Drag & Drop
document.addEventListener('DOMContentLoaded', () => {
    // Enhanced Voting functionality with real-time updates - DECLARE FIRST
    let votingStates = new Map(); // Track which memes user has voted on
    let lastUpdateTime = Date.now();
    
    // Initialize voting states from server-side data
    initializeVotingStates();
    
    // Enhanced Upload Form Functionality
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('meme_file');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const fileInfo = document.getElementById('file-info');
    const removePreviewBtn = document.getElementById('remove-preview');
    const form = document.getElementById('meme-upload-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // File validation
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
    
    console.log('Memes upload JavaScript loaded');
    
    if (!dropZone || !fileInput) {
        console.error('Drop zone or file input not found');
        return;
    }
    
    // Click to open file dialog - Simple and effective
    dropZone.addEventListener('click', () => {
        console.log('Drop zone clicked, opening file dialog...');
        fileInput.click(); 
    });
    
    // Enhanced drag and drop events for better desktop compatibility
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('border-yellow-400', 'bg-yellow-500/20');
        const icon = dropZone.querySelector('#drop-content .text-4xl');
        if (icon) icon.textContent = '📂';
        console.log('Drag over');
    });
    
    dropZone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('border-yellow-400', 'bg-yellow-500/20');
        console.log('Drag enter');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Only remove styles if we're leaving the drop zone entirely
        if (!dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('border-yellow-400', 'bg-yellow-500/20');
            const icon = dropZone.querySelector('#drop-content .text-4xl');
            if (icon) icon.textContent = '📁';
            console.log('Drag leave');
        }
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('border-yellow-400', 'bg-yellow-500/20');
        const icon = dropZone.querySelector('#drop-content .text-4xl');
        if (icon) icon.textContent = '📁';
        
        const files = e.dataTransfer.files;
        console.log('Files dropped:', files.length);
        if (files.length > 0) {
            // Create a DataTransfer to update file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0]);
            fileInput.files = dataTransfer.files; // Sync with input
            handleFileSelection(files[0]);
        }
    });
    
    // Enhanced file input change handler
    fileInput.addEventListener('change', (e) => {
        console.log('File input changed');
        const files = e.target.files;
        if (files && files.length > 0) {
            console.log('File selected via input:', files[0].name);
            selectedFile = files[0]; // Keep global variable in sync
            handleFileSelection(files[0]);
        } else {
            // Clear selection if no file
            selectedFile = null;
        }
    });
    
    // Store the selected file globally
    let selectedFile = null;
    
    // Handle file selection and validation
    function handleFileSelection(file) {
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            alert('❌ Please select a PNG, JPG, or GIF image.');
            return;
        }
        
        // Validate file size
        if (file.size > maxFileSize) {
            alert('❌ File size must be less than 10MB.');
            return;
        }
        
        // Store the file globally
        selectedFile = file;
        
        // Show preview
        showPreview(file);
    }
    
    // Show image preview with skeleton loader - Bulletproof version
    function showPreview(file) {
        if (!previewContainer || !previewImage || !fileInfo) {
            console.error('Preview elements not found');
            return;
        }

        previewContainer.classList.remove('hidden');

        // Clear skeletons properly
        previewContainer.querySelectorAll('.skeleton-loader').forEach(el => el.remove());

        // Add skeleton loader
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-loader w-full h-48 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg border border-yellow-500 dark:border-yellow-400';
        previewContainer.appendChild(skeleton);

        // Hide the image until it's ready
        previewImage.style.display = 'none';

        const reader = new FileReader();
        reader.onload = function (e) {
            // Remove skeleton
            skeleton.remove();

            // Apply the base64 string
            previewImage.src = e.target.result;
            previewImage.alt = file.name;

            // Show image with fade-in
            previewImage.style.display = 'block';
            previewImage.classList.remove('opacity-0');
            previewImage.classList.add('opacity-100', 'transition-opacity', 'duration-300');

            console.log('✅ Preview image loaded successfully');

            // Update file info
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
            fileInfo.textContent = `${file.name} (${sizeInMB} MB)`;

            // Hide drop content
            const dropContent = document.getElementById('drop-content');
            if (dropContent) dropContent.style.display = 'none';

            // Show success message
            let successMsg = dropZone.querySelector('.success-message');
            if (!successMsg) {
                successMsg = document.createElement('div');
                successMsg.className = 'success-message text-green-400 text-lg';
                successMsg.textContent = '✅ File ready to upload!';
                dropZone.appendChild(successMsg);
            }
            successMsg.style.display = 'block';
        };

        reader.onerror = () => {
            skeleton.remove();
            previewImage.style.display = 'none';
            previewContainer.classList.add('hidden');
            alert('❌ Failed to read the selected file.');
        };

        reader.readAsDataURL(file);
    }
    
    // Remove preview
    if (removePreviewBtn) {
        removePreviewBtn.addEventListener('click', () => {
            resetUploadForm();
        });
    }
    
    // Reset form to initial state
    function resetUploadForm() {
        selectedFile = null;
        fileInput.value = '';
        
        // Reset preview container and image
        if (previewContainer) previewContainer.classList.add('hidden');
        if (previewImage) {
            previewImage.src = '';
            previewImage.style.display = 'block';
            previewImage.classList.remove('opacity-0', 'opacity-100', 'transition-opacity', 'duration-300');
        }
        if (fileInfo) fileInfo.textContent = '';
        
        // Remove skeleton loader if it exists
        const skeleton = previewContainer?.querySelector('.skeleton-loader');
        if (skeleton) {
            skeleton.remove(); // Remove completely, not just hide
        }
        
        // Reset drop zone appearance but preserve structure
        dropZone.classList.remove('border-green-500', 'bg-green-500/10');
        
        // Show the original drop content
        const dropContent = document.getElementById('drop-content');
        if (dropContent) {
            dropContent.style.display = 'block';
        }
        
        // Hide the success message
        const successMsg = dropZone.querySelector('.success-message');
        if (successMsg) {
            successMsg.style.display = 'none';
        }
        
        console.log('Form reset');
    }
    
    // Form submission - ALWAYS use fetch with global file
    if (form && submitBtn && submitText && loadingSpinner) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Always prevent default form submission
            
            // Check for selected file - either from global variable or file input
            const fileToUpload = selectedFile || (fileInput.files && fileInput.files[0]);
            
            if (!fileToUpload) {
                alert('❌ Please select a file to upload.');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            
            // Create FormData with our selected file
            const formData = new FormData();
            formData.append('file', fileToUpload);
            formData.append('description', document.getElementById('meme_desc').value || '');
            
            console.log('Uploading file:', fileToUpload.name);
            
            // Submit using fetch
            fetch(form.action || '/memes', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    throw new Error(`Upload failed with status: ${response.status}`);
                }
            })
            .catch(error => {
                console.error('Upload error:', error);
                alert('❌ Upload failed. Please try again.');
                
                // Reset loading state
                submitBtn.disabled = false;
                submitText.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
                submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            });
        });
    }
    
    // Initialize voting states from server-side data
    function initializeVotingStates() {
        // Check for voted memes from the server session
        document.querySelectorAll('.vote-btn.voted').forEach(btn => {
            const memeId = btn.dataset.id;
            votingStates.set(memeId, 'voted');
            // Remove click handler for already voted buttons
            btn.onclick = null;
        });
    }
    
    // Initialize voting states when page loads
    initializeVotingStates();
    
    async function handleVote(memeId, isLightbox = false) {
        const votesSpan = isLightbox ? 
            document.getElementById('lightbox-vote-count') : 
            document.getElementById(`votes-${memeId}`);
        const voteBtn = isLightbox ? 
            document.getElementById('lightbox-vote-btn') : 
            document.querySelector(`[data-id="${memeId}"]`);
            
        // Prevent double voting
        if (votingStates.get(memeId) === 'voted') {
            return;
        }
        
        // Set voting state immediately for better UX
        votingStates.set(memeId, 'voting');
        voteBtn.disabled = true;
        voteBtn.innerHTML = '⏳ Voting...';
        voteBtn.classList.add('opacity-75');
            
        try {
            // Send a POST request to the voting API endpoint
            const response = await fetch(`/api/vote/${memeId}`, { method: 'POST' });
            const data = await response.json();

            if (response.ok) {
                // Mark as voted
                votingStates.set(memeId, 'voted');
                
                // Animate vote count update
                animateVoteCount(votesSpan, data.votes);
                
                // Update both regular and lightbox vote counts if both exist
                updateAllVoteCounts(memeId, data.votes);
                
                // Update button to voted state with glow effect
                updateVoteButtonToVoted(memeId);
                
                // Trigger celebration effect
                triggerVoteCelebration(voteBtn);
                
            } else {
                // Reset voting state on error
                votingStates.set(memeId, 'available');
                resetVoteButton(voteBtn);
                alert(data.error || 'Failed to vote.');
            }
        } catch (error) {
            console.error('Error voting:', error);
            votingStates.set(memeId, 'available');
            resetVoteButton(voteBtn);
            alert('An error occurred while voting.');
        }
    }
    
    function animateVoteCount(votesSpan, newCount) {
        votesSpan.classList.add('animate');
        votesSpan.textContent = newCount;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            votesSpan.classList.remove('animate');
        }, 600);
    }
    
    function updateAllVoteCounts(memeId, newCount) {
        // Update regular vote count
        const regularVotesSpan = document.getElementById(`votes-${memeId}`);
        if (regularVotesSpan) {
            regularVotesSpan.textContent = newCount;
        }
        
        // Update lightbox vote count if it's showing the same meme
        const lightboxVotesSpan = document.getElementById('lightbox-vote-count');
        const lightboxBtn = document.getElementById('lightbox-vote-btn');
        if (lightboxVotesSpan && lightboxBtn && lightboxBtn.dataset.id === memeId) {
            lightboxVotesSpan.textContent = newCount;
        }
    }
    
    function updateVoteButtonToVoted(memeId) {
        // Update all vote buttons for this meme
        document.querySelectorAll(`[data-id="${memeId}"]`).forEach(btn => {
            btn.disabled = false; // Keep enabled but show voted state
            btn.innerHTML = '✅ Voted!';
            btn.classList.remove('btn-gradient', 'opacity-75');
            btn.classList.add('voted', 'voted-glow');
            btn.onclick = null; // Remove click handler
        });
        
        // Update lightbox vote button if it exists and matches
        const lightboxBtn = document.getElementById('lightbox-vote-btn');
        if (lightboxBtn && lightboxBtn.dataset.id === memeId) {
            lightboxBtn.disabled = false;
            lightboxBtn.innerHTML = '✅ Voted!';
            lightboxBtn.classList.remove('btn-gradient', 'opacity-75');
            lightboxBtn.classList.add('voted', 'voted-glow');
            lightboxBtn.onclick = null;
        }
    }
    
    function resetVoteButton(voteBtn) {
        voteBtn.disabled = false;
        voteBtn.innerHTML = 'Vote 👍';
        voteBtn.classList.remove('opacity-75');
    }
    
    function triggerVoteCelebration(voteBtn) {
        // Add celebration particles effect
        voteBtn.classList.add('vote-celebration');
        
        // Create floating +1 effect
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-vote-text';
        floatingText.textContent = '+1';
        floatingText.style.position = 'absolute';
        floatingText.style.color = '#10B981';
        floatingText.style.fontWeight = 'bold';
        floatingText.style.fontSize = '1.2rem';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.zIndex = '1000';
        
        const rect = voteBtn.getBoundingClientRect();
        floatingText.style.left = (rect.left + rect.width / 2) + 'px';
        floatingText.style.top = (rect.top - 10) + 'px';
        
        document.body.appendChild(floatingText);
        
        // Animate the floating text
        floatingText.animate([
            { transform: 'translateY(0px)', opacity: 1 },
            { transform: 'translateY(-30px)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            document.body.removeChild(floatingText);
        };
        
        // Remove celebration class after animation
        setTimeout(() => {
            voteBtn.classList.remove('vote-celebration');
        }, 1000);
    }
    
    // Real-time vote updates using polling
    async function pollVoteUpdates() {
        try {
            const response = await fetch('/api/votes/updates?since=' + lastUpdateTime);
            if (response.ok) {
                const updates = await response.json();
                
                updates.forEach(update => {
                    // Only update if user hasn't voted on this meme
                    if (votingStates.get(update.memeId) !== 'voted') {
                        updateAllVoteCounts(update.memeId, update.votes);
                        
                        // Add subtle pulse effect to show live update
                        const votesSpan = document.getElementById(`votes-${update.memeId}`);
                        if (votesSpan) {
                            votesSpan.classList.add('live-update-pulse');
                            setTimeout(() => {
                                votesSpan.classList.remove('live-update-pulse');
                            }, 1000);
                        }
                    }
                });
                
                lastUpdateTime = Date.now();
            }
        } catch (error) {
            console.log('Polling update failed (normal if API not implemented):', error);
        }
    }
    
    // Start polling for vote updates every 10 seconds
    setInterval(pollVoteUpdates, 10000);
    
    // Also poll when page becomes visible again
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            pollVoteUpdates();
        }
    });
    
    // Regular vote buttons
    document.querySelectorAll('.vote-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const memeId = e.target.dataset.id;
            if (memeId) {
                await handleVote(memeId, false);
            }
        });
    });
    
    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxVoteCount = document.getElementById('lightbox-vote-count');
    const lightboxVoteBtn = document.getElementById('lightbox-vote-btn');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Add error handling for lightbox image
    if (lightboxImage) {
        lightboxImage.addEventListener('error', function() {
            this.src = 'https://placehold.co/600x400/4A2C0B/FFD700?text=Meme+Failed+to+Load';
        });
    }
    
    // Open lightbox when meme image is clicked
    document.querySelectorAll('.meme-image').forEach(image => {
        // Add error handling for images
        image.addEventListener('error', function() {
            this.src = 'https://placehold.co/400x400/4A2C0B/FFD700?text=Meme+Failed+to+Load';
        });
        
        image.addEventListener('click', (e) => {
            const memeId = e.target.dataset.memeId;
            const memeFilename = e.target.dataset.memeFilename;
            const memeDescription = e.target.dataset.memeDescription;
            const memeVotes = e.target.dataset.memeVotes;
            const imageSrc = e.target.src;
            
            // Set lightbox content
            lightboxImage.src = imageSrc;
            lightboxImage.alt = memeDescription;
            lightboxDescription.textContent = memeDescription;
            lightboxVoteCount.textContent = memeVotes;
            lightboxVoteBtn.dataset.id = memeId;
            
            // Check voting state and update button accordingly
            const isVoted = votingStates.get(memeId) === 'voted';
            
            if (isVoted) {
                lightboxVoteBtn.disabled = false; // Keep enabled but show voted state
                lightboxVoteBtn.innerHTML = '✅ Voted!';
                lightboxVoteBtn.classList.remove('btn-gradient');
                lightboxVoteBtn.classList.add('voted', 'voted-glow');
                lightboxVoteBtn.onclick = null;
            } else {
                lightboxVoteBtn.disabled = false;
                lightboxVoteBtn.innerHTML = 'Vote 👍';
                lightboxVoteBtn.classList.remove('voted', 'voted-glow');
                lightboxVoteBtn.classList.add('btn-gradient');
                lightboxVoteBtn.onclick = () => handleVote(memeId, true);
            }
            
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Lightbox vote button
    lightboxVoteBtn.addEventListener('click', async (e) => {
        const memeId = e.target.dataset.id;
        if (memeId) {
            await handleVote(memeId, true);
        }
    });
    
    
    // --- Diagnose & auto-fix broken meme image paths ---
    (function ensureMemeImagesVisible() {
        const BASE_CANDIDATE = '/static/memes/'; // Adjust if your public path is different
        
        document.querySelectorAll('.meme-image').forEach((img) => {
            // If the image is already cached as broken, naturalWidth will be 0 after complete
            if (img.complete && img.naturalWidth === 0) tryFix(img);
            
            img.addEventListener('error', () => tryFix(img), { once: true });
            
            function tryFix(imageEl) {
                if (imageEl.dataset.__fixed) return; // avoid loops
                console.warn('Image failed to load:', imageEl.src);
                
                // If we know the filename, try switching to /static/memes/<filename>
                const fileFromData = imageEl.dataset.memeFilename;
                const guessedFile = fileFromData || imageEl.src.split('/').pop().split('?')[0];
                
                if (!guessedFile) return;
                
                const candidate = BASE_CANDIDATE + guessedFile;
                if (candidate !== imageEl.src) {
                    imageEl.dataset.__fixed = '1';
                    // add a cache-buster to avoid stale 404s
                    imageEl.src = candidate + (candidate.includes('?') ? '&' : '?') + 'v=' + Date.now();
                }
            }
        });
    })();
    
    console.log('Enhanced memes functionality initialized');
});
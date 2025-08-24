// Fresh Memes Upload Functionality - Built from Scratch
document.addEventListener('DOMContentLoaded', () => {
    console.log('Fresh memes upload system loading...');
    
    // Get DOM elements
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
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
    
    if (!dropZone || !fileInput) {
        console.error('Required elements not found');
        return;
    }
    
    let selectedFile = null;
    
    // Simple click to browse
    dropZone.addEventListener('click', () => {
        console.log('Opening file browser...');
        fileInput.click();
    });
    
    // Drag and drop handlers
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('border-yellow-400', 'bg-yellow-500/20');
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('border-yellow-400', 'bg-yellow-500/20');
    }
    
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('border-yellow-400', 'bg-yellow-500/20');
        }
    }
    
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('border-yellow-400', 'bg-yellow-500/20');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            selectFile(files[0]);
        }
    }
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            selectFile(e.target.files[0]);
        }
    });
    
    // File selection and validation
    function selectFile(file) {
        console.log('File selected:', file.name);
        
        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            alert('❌ Please select a PNG, JPG, or GIF image.');
            return;
        }
        
        // Validate file size
        if (file.size > MAX_SIZE) {
            alert('❌ File size must be less than 10MB.');
            return;
        }
        
        selectedFile = file;
        showPreview(file);
    }
    
    // Simple, reliable preview
    function showPreview(file) {
        console.log('Showing preview for:', file.name);
        
        // Show preview container
        previewContainer.classList.remove('hidden');
        
        // Create and show skeleton
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton w-full h-48 bg-gray-300 animate-pulse rounded-lg';
        skeleton.id = 'preview-skeleton';
        
        // Clear any existing skeletons
        const oldSkeleton = document.getElementById('preview-skeleton');
        if (oldSkeleton) oldSkeleton.remove();
        
        previewContainer.appendChild(skeleton);
        previewImage.style.display = 'none';
        
        // Read file
        const reader = new FileReader();
        reader.onload = function(e) {
            // Remove skeleton
            skeleton.remove();
            
            // Show image
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            
            // Show file info
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            fileInfo.textContent = `${file.name} (${sizeMB} MB)`;
            
            // Hide drop zone content
            const dropContent = document.getElementById('drop-content');
            if (dropContent) dropContent.style.display = 'none';
            
            console.log('✅ Preview loaded successfully');
        };
        
        reader.onerror = function() {
            skeleton.remove();
            previewContainer.classList.add('hidden');
            alert('❌ Failed to read file');
        };
        
        reader.readAsDataURL(file);
    }
    
    // Remove preview
    if (removePreviewBtn) {
        removePreviewBtn.addEventListener('click', resetForm);
    }
    
    function resetForm() {
        selectedFile = null;
        fileInput.value = '';
        previewContainer.classList.add('hidden');
        previewImage.src = '';
        fileInfo.textContent = '';
        
        // Remove skeleton if exists
        const skeleton = document.getElementById('preview-skeleton');
        if (skeleton) skeleton.remove();
        
        // Show drop content
        const dropContent = document.getElementById('drop-content');
        if (dropContent) dropContent.style.display = 'block';
        
        console.log('Form reset');
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        if (!selectedFile) {
            alert('❌ Please select a file to upload.');
            return;
        }
        
        console.log('Uploading:', selectedFile.name);
        
        // Show loading state
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        
        // Create form data
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const description = document.getElementById('meme_desc');
        if (description && description.value) {
            formData.append('description', description.value);
        }
        
        // Submit
        fetch(form.action || '/memes', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('✅ Upload successful');
                window.location.reload();
            } else {
                throw new Error(`Upload failed: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('Upload error:', error);
            alert('❌ Upload failed. Please try again.');
            
            // Reset loading state
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        });
    }
    
    console.log('✅ Fresh upload system ready');
});

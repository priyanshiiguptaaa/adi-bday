// Slideshow functionality for Adi's photos
document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
});

function initSlideshow() {
    const photos = document.querySelectorAll('.adi-photo');
    let currentPhotoIndex = 0;
    
    // Set the first photo as active initially
    photos[0].classList.add('active');
    
    // Function to switch to the next photo
    function showNextPhoto() {
        // Remove active class from current photo
        photos[currentPhotoIndex].classList.remove('active');
        
        // Move to the next photo (loop back to the first if at the end)
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        
        // Add active class to the new current photo
        photos[currentPhotoIndex].classList.add('active');
    }
    
    // Set interval to change photos every 5 seconds
    setInterval(showNextPhoto, 5000);
}

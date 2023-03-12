function getFreeVBucks() {
    //embed youtube video with i frame and pop up on the page
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1');
    iframe.setAttribute('width', '640');
    iframe.setAttribute('height', '360');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '1');
    iframe.setAttribute('allow', 'autoplay');
    document.body.appendChild(iframe);
}
function loadProjects() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'projects.json', false);
    xhr.send(null);

    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error('Failed to load projects.json');
        return [];
    }
}
function createProjectElement(project) {
    var projectElement = document.createElement('div');
    projectElement.className = 'project';

    var imageElement = document.createElement('img');
    imageElement.src = project.image;
    imageElement.alt = project.title;
    imageElement.classList.add('project-image'); // Neue CSS-Klasse für das Bild
    projectElement.appendChild(imageElement);

    var projectInfoElement = document.createElement('div');
    projectInfoElement.classList.add('project-info'); // Neue CSS-Klasse für den Projektinfo-Bereich

    var titleElement = document.createElement('h3');
    titleElement.textContent = project.title;
    projectInfoElement.appendChild(titleElement);

    var descriptionElement = document.createElement('p');
    descriptionElement.textContent = project.description;
    projectInfoElement.appendChild(descriptionElement);

    projectElement.appendChild(projectInfoElement);

    var linkElement = document.createElement('a');
    linkElement.href = project.link;
    linkElement.textContent = 'View';
    projectElement.appendChild(linkElement);

    //wenn project cancelled, dann wird ein Hinweis angezeigt
    //json = "cancelled": true
    if (project.cancelled) {
        var cancelledElement = document.createElement('p');
        cancelledElement.textContent = 'This project has been cancelled.';
        cancelledElement.classList.add('cancelled'); // Neue CSS-Klasse für abgesagte Projekte
        projectElement.appendChild(cancelledElement);
    }

    return projectElement;
}


function renderProjects(projects) {
    var projectsElement = document.getElementById('projects');
    projectsElement.innerHTML = '';

    projects.forEach(function(project) {
        var projectElement = createProjectElement(project);
        projectsElement.appendChild(projectElement);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var projects = loadProjects();
    renderProjects(projects);
});
document.getElementById('fetchUrls').addEventListener('click', async () => {
    const keyword = document.getElementById('keyword').value;
    const response = await fetch(`http://localhost:3000/urls?keyword=${keyword}`);
    const urls = await response.json();
    const urlList = document.getElementById('urlList');
    urlList.innerHTML = '';
    urls.forEach(url => {
        const li = document.createElement('li');
        li.textContent = url;
        li.addEventListener('click', () => downloadContent(url));
        urlList.appendChild(li);
    });
});

async function downloadContent(url) {
    const downloadStatus = document.getElementById('downloadStatus');
    downloadStatus.style.display = 'block';
    downloadStatus.textContent = 'Загрузка началась...';

    const response = await fetch(`http://localhost:3000/download?url=${encodeURIComponent(url)}`);
    const reader = response.body.getReader();
    let receivedLength = 0;
    const chunks = [];
    const contentLength = +response.headers.get('Content-Length');

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        chunks.push(value);
        receivedLength += value.length;
        const percentCompleted = Math.round((receivedLength * 100) / contentLength);
        downloadStatus.textContent = `Загружено ${receivedLength} из ${contentLength} байт (${percentCompleted}%)`;
    }

    const content = new TextDecoder("utf-8").decode(new Uint8Array(chunks.flat()));
    const contentList = document.getElementById('downloadedFilesList');
    const li = document.createElement('li');
    li.textContent = url;
    li.addEventListener('click', () => window.open(url, '_blank'));
    contentList.appendChild(li);
    localStorage.setItem(url, content);

    window.open(url, '_blank');

    downloadStatus.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const contentList = document.getElementById('downloadedFilesList');
    for (let i = 0; i < localStorage.length; i++) {
        const url = localStorage.key(i);
        const content = localStorage.getItem(url);
        const li = document.createElement('li');
        li.textContent = url;
        li.addEventListener('click', () => window.open(url, '_blank'));
        contentList.appendChild(li);
    }
});
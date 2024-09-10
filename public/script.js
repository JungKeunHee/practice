document.getElementById('submit-btn').addEventListener('click', function() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    const data = { title, author, content };

    fetch('/addPost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('등록성공');
            window.location.href = '/';
        } else {
            alert('등록실패');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
document.addEventListener("DOMContentLoaded", function() {});

const urlBar = 'http://localhost:3000/books/';

const listBooks = () => {
    fetch(urlBar)
    .then(res => res.json())
    .then(data => {
        createBookList(data);
    });
};

const bookInfo = document.querySelector('#show-panel')

const createBookList = (books) => {
    const ulList = document.querySelector('#list');

    books.forEach(book => {
        const bookList = document.createElement('li')

        bookList.textContent = book.title;
        bookList.className = 'shown-books'
        bookList.dataset.id = book.id;

        ulList.appendChild(bookList);
    });

    ulList.addEventListener('click', function(e) {
        if(e.target.className === 'shown-books') {
            const bookID = e.target.dataset.id;
            getBookInfo(bookID);
        };
    });
};


//Patch here

const usersLiked = document.createElement('ul');

function getBookInfo(id){
    fetch(urlBar + `${id}`)
    .then(res => res.json())
    .then(data => {
        bookInfo.innerHTML = '';

        const thumbBook = document.createElement('img');
        thumbBook.src = data.img_url;

        const titleBook = document.createElement('h2');
        titleBook.textContent = data.title;

        const subtitleBook = document.createElement('h3');
        subtitleBook.textContent = data.subtitle;

        const authBook = document.createElement('h4');
        authBook.textContent = data.author;

        const descBook = document.createElement('p');
        descBook.textContent = data.description;

        
        const usersLiked = document.createElement('ul');
//        usersLiked.textContent = data.users.username;//incorrect
        data.users.forEach(user => {
            const userLi = document.createElement('li');
            userLi.textContent = user.username;
            usersLiked.appendChild(userLi);
        })

        const likedBook = document.createElement('button');
        likedBook.classList.add('like-button')
        likedBook.textContent = 'LIKE';

        bookInfo.appendChild(thumbBook);
        bookInfo.appendChild(titleBook);
        bookInfo.appendChild(subtitleBook);
        bookInfo.appendChild(authBook);
        bookInfo.appendChild(descBook);
        bookInfo.appendChild(usersLiked);
        bookInfo.appendChild(likedBook);



        likedBook.addEventListener('click', function(e) {
            const user = { id: 1, username: "pouros" }
            
            fetch(urlBar + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    users: [...data.users, user] // Append the new user to the existing users array, first arrary is what's already there (as a clone, and then the comma says the next part of the array, which is my new user declared above)
                }),
            })
            .then(res => res.json())
            .then(updatedBook => {
                usersLiked.innerHTML = ''; 

                //const newLikedUsers = document.createElement('ul');
                updatedBook.users.forEach(user => {
                    const userLi = document.createElement('li');
                    userLi.textContent = user.username;
                    usersLiked.appendChild(userLi);
                //    newLikedUsers.appendChild(userLi);
                });

                //bookInfo.appendChild(newLikedUsers);
            })
            .catch(error => console.error(error))
        });
        
    });
    bookInfo.appendChild(usersLiked);
}

listBooks()
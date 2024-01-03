const book = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK-APPS';

function generateId() {
    return + new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year: parseInt(year),
        isComplete
    };
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(book);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(RENDER_EVENT, function() {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML ='';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of book) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) 
            incompleteBookshelfList.append(bookElement);
        else
        completeBookshelfList.append(bookElement);        
    };
});

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
})

document.addEventListener('DOMContentLoaded', function() {
    const inputBook = document.getElementById('inputBook');

    inputBook.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const id = generateId();
    const bookObject = generateBookObject(id, title, author, year, isComplete);
    book.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function makeBook(bookObject) {
    const titleText = document.createElement('h2');
    titleText.innerText = bookObject.title;
    titleText.classList.add('styling')
    const authorText = document.createElement('h3');
    authorText.innerText = bookObject.author;
    authorText.classList.add('display', 'time');

    const timestampText = document.createElement('p');
    timestampText.innerText = bookObject.year;
    timestampText.classList.add('display');

    const textBookContainer = document.createElement('div');
    textBookContainer.classList.add('inner');
    textBookContainer.append(titleText, authorText, timestampText);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textBookContainer);
    container.setAttribute('id', 'book-${bookObject.id}');

    if (bookObject.isComplete) {
        const unButton = document.createElement('button');
        unButton.classList.add('undo-outline');

        unButton.addEventListener('click', function() {
            undoTaskFromCompleted(bookObject.id);
        });

        const tongButton = document.createElement('button');
        tongButton.classList.add('trash-outline');

        tongButton.addEventListener('click', function() {
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(unButton, tongButton);
    } else {
        const ceklisButton = document.createElement('button');
        ceklisButton.classList.add('check-outline');

        ceklisButton.addEventListener('click', function() {
            addTaskToCompleted(bookObject.id);
        });

        const tongButton = document.createElement('button');
        tongButton.classList.add('trash-outline');

        tongButton.addEventListener('click', function() {
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(ceklisButton, tongButton);
    }

    return container;
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    book.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in book) {
        if (book[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete =false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of book) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function loadDataFromStorage() {
    const serialData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serialData);

    if (data !== null) {
        for (const books of data) {
            book.push(books);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
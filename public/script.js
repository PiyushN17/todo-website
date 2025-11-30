let add = document.getElementById('add');
let del = document.getElementById('delete');
let update = document.getElementById('update');
let view = document.getElementById('view');
let mark = document.getElementById('mark-unmark');
let container = document.getElementById('container');
let title = document.getElementById('title');
let description = document.getElementById('description');
let check = document.getElementById('check');
let input = document.getElementById('input');
let inTitle = document.getElementById('inputTitle');
let desc = document.getElementById('desc');
let addToList = document.getElementById('addToList');
let err = document.getElementById('err');

add.addEventListener('click', function() {
    add.disabled = true;
    input.hidden = false;
});
addToList.addEventListener('click', function() {
    if(inTitle.value === '' && desc.value === '') {
        err.innerText = 'Please enter something';
    }
    else {
        err.innerText = '';
        add.disabled = false;
        const todo = {
            title: inTitle.value,
            description: desc.value
        };
        fetch('/add-todo', {
            method: 'POST',
            headers: {
                'content-type': 'application/javascript'
            },
            body: JSON.stringify(todo)
        })
        .then(value => value.json())
        .then(data => {
            inTitle.value = '';
            desc.value = '';
        })
        .catch(e => {
            console.log(e);
        })
    }
});

view.addEventListener('click', function() {
    const output = fetch('/data.json');
    output.then(value => {
        return value.json();
    })
    .then(value => {
        container.innerHTML = '';
        for(let val of value) {
            const t = document.createElement('h3');
            t.innerText = 'Title: ' + val.title;

            const d = document.createElement('p');
            d.innerText = 'Description: ' + val.description;

            container.appendChild(t);
            container.appendChild(d);
        }
    });

})
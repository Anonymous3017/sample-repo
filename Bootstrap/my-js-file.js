const taskContainer = document.querySelector(".task_container");
let globalStore = [];//array of objects
//console.log(taskContainer);

const generateNewCard = (taskData) => `
        <div class="col-sm-12 col-md-6 col-lg-4" id=${taskData.id}>
            <div class="card">
                <div class="card-header d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-success"><i class="fas fa-pencil-alt"></i></button>
                    <button type="button" class="btn btn-danger" id=${taskData.id} onclick="deleteCard.apply(this, arguments)"><i class="fas fa-trash-alt" id=${taskData.id} onclick="deleteCard.apply(this, arguments)"></i></button>
                </div>
                <div class="card-body">
                    <img src=${taskData.imageUrl} class="card-img-top" alt="f8th_image">
                    <h5 class="card-title mt-3 fw-bold  text-primary ">${taskData.taskTitle}</h5>
                    <p class="card-text">${taskData.taskDescription}</p>
                    <a href="#" class="btn btn-primary">${taskData.taskType}</a>
                </div>
            </div>
        </div>
`;


const loadInitialCardData = () => {
    //localstorage to get tasky card data
    const getCardData = localStorage.getItem("tasky");

    //convert it to normal object
    const { cards } = JSON.parse(getCardData);

    //loop over those array of task object to create HTML cards, inject it to DOM
    cards.map((taskData) => {
        //inject it to DOM
        taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));

        //update our globalStore
        globalStore.push(taskData);
    });
    console.log(globalStore);

};

const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`,
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };
    console.log(taskData);

    const newCard = `
        <div class="col-sm-12 col-md-6 col-lg-4" id=${taskData.id}>
            <div class="card">
                <div class="card-header d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-success" onclick="editCard.apply(this, arguments)"><i class="fas fa-pencil-alt"></i></button>
                    <button type="button" class="btn btn-danger" onclick="deleteCard.apply(this, arguments)" ><i class="fas fa-trash-alt"></i></button>
                </div>
                <div class="card-body">
                    <img src=${taskData.imageUrl} class="card-img-top" alt="f8th_image">
                    <h5 class="card-title mt-3 fw-bold  text-primary ">${taskData.taskTitle}</h5>
                    <p class="card-text">${taskData.taskDescription}</p>
                    <a href="#" class="btn btn-primary">${taskData.taskType}</a>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-outline-primary float-right" onclick="openCard.apply(this, arguments)" data-bs-toggle="modal" data-bs-target="#showTask">Open Task</button>
                </div>
            </div>
        </div>
    `;

    taskContainer.insertAdjacentHTML("beforeend", newCard)

    globalStore.push(taskData);
    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));

};

const updateLocalStorage = () => {
    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));
}

const deleteCard = (event) => {
    event = window.event;
    //id
    const targetID = event.target.id;
    const tagname = event.target.tagName;//BUTTON
    //match the id of the element with the id inside the globalStore
    //if match found remove
    globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);
    updateLocalStorage();
    //contact parent
    if (tagname === "BUTTON") {
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
    } else {
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
    }

}

const editCard = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;//BUTTON
    let parentElement;

    if (tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[3].childNodes[3];
    let taskDescription = parentElement.childNodes[3].childNodes[5];
    let taskType = parentElement.childNodes[3].childNodes[7];
    let submitButton = parentElement.childNodes[5].childNodes[1];
    //setAttributes
    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEditChanges.apply(this, arguments)");
    submitButton.innerHTML = "Save Changes";
}

const saveEditChanges = (event) => {
    event = window.event;
    const targetID = event.target.id;
    console.log(targetID);
    const tagname = event.target.tagName;//BUTTON
    let parentElement;

    if (tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[3].childNodes[3];
    let taskDescription = parentElement.childNodes[3].childNodes[5];
    let taskType = parentElement.childNodes[3].childNodes[7];
    let submitButton = parentElement.childNodes[5].childNodes[1];

    const updatedData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };
    globalStore = globalStore.map((task) => {
        if (task.id === targetID) {
            return {
                id: task.id,
                imageUrl: task.imageUrl,
                taskTitle: updatedData.taskTitle,
                taskType: updatedData.taskType,
                taskDescription: updatedData.taskDescription,
            };
        }
        return task;//important
    });
    updateLocalStorage();
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.removeAttribute("onclick");
    submitButton.innerHTML = "Open Task";
}


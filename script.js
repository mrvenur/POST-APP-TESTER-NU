"use strict";

// ============== global variables ============== //
const endpoint = "https://projekt-merve-nour-default-rtdb.firebaseio.com/";
let posts;

// ============== load and init app ============== //

window.addEventListener("load", initApp);

function initApp() {
  updatePostsGrid(); // update the grid of posts: get and show all posts

  // event listener
  document
    .querySelector("#form-create-post")
    .addEventListener("submit", createPostClicked);

  document
    .querySelector("#form-delete-post")
    .addEventListener("submit", deletePostClicked);

  document
    .querySelector("#form-delete-post .btn-cancel")
    .addEventListener("click", cancelDelete);

  document
    .querySelector("#form-update-post")
    .addEventListener("submit", updatePostClicked);
}

// ============== events ============== //

function cancelDelete() {
  console.log("cancel btn clicked");
  document.querySelector("#dialog-delete-post").close();
}

function createPostClicked(event) {
  event.preventDefault();
  const form = event.target;
  const image = form.image.value;
  const description = form.body.value;
  const name = form.title.value;
  const year = new Date().getFullYear();
  const song = form.song.value;

  createPost(name, song, year, description, image);

  // Reset the form after creating a new post
  form.reset();
}

function showCreatePostDialog() {
  console.log("Create New Post clicked!");
  window.location.href = "create-post.html";
}

// ============== posts ============== //

async function updatePostsGrid() {
  posts = await getPosts(); // get posts from rest endpoint and save in global variable
  showPosts(posts); // show all posts (append to the DOM) with posts as argument
}

// Get all posts - HTTP Method: GET
async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`); // fetch request, (GET)
  const data = await response.json(); // parse JSON to JavaScript
  const posts = prepareData(data); // convert object of object to array of objects
  return posts; // return posts
}

function showPosts(listOfPosts) {
  document.querySelector("#posts").innerHTML = ""; // reset the content of section#posts

  for (const post of listOfPosts) {
    showPost(post); // for every post object in listOfPosts, call showPost
  }
}

function showPost(postObject) {
  const html = /*html*/ `
    <article class="grid-item">
      <img src="${postObject.image}" />
      <h3>${postObject.name} - ${postObject.song} (${postObject.year})</h3>
      <p>${postObject.description}</p>
      <div class="btns">
        <button class="btn-delete">Delete</button>
        <button class="btn-update">Update</button>
      </div>
    </article>
  `;

  document.querySelector("#posts").insertAdjacentHTML("beforeend", html);

  // add event listeners to .btn-delete and .btn-update
  const lastArticle = document.querySelector("#posts article:last-child");
  lastArticle
    .querySelector(".btn-delete")
    .addEventListener("click", deleteClicked);
  lastArticle.querySelector(".btn-update").addEventListener("click", update);
}

function showPost(postObject) {
  const html = /*html*/ `
    <article class="grid-item">
      <img src="${postObject.image}" />
      <h3>${postObject.name} - ${postObject.song} (${postObject.year})</h3>
      <p>${postObject.description}</p>
      <div class="btns">
        <button class="btn-delete">Delete</button>
        <button class="btn-update">Update</button>
      </div>
    </article>
  `;

  document.querySelector("#posts").insertAdjacentHTML("beforeend", html);

  // add event listeners to .btn-delete and .btn-update
  const lastArticle = document.querySelector("#posts article:last-child");
  lastArticle
    .querySelector(".btn-delete")
    .addEventListener("click", deleteClicked);
  lastArticle
    .querySelector(".btn-update")
    .addEventListener("click", updateClicked);

  // called when delete button is clicked
  function deleteClicked() {
    console.log("Delete button clicked");
    document.querySelector("#dialog-delete-post-title").textContent =
      postObject.name + " - " + postObject.song + " (" + postObject.year + ")";
    document
      .querySelector("#form-delete-post")
      .setAttribute("data-id", postObject.id);
    document.querySelector("#dialog-delete-post").showModal();
  }

  // called when update button is clicked
  function updateClicked() {
    console.log("Update button clicked");
    const updateForm = document.querySelector("#form-update-post");
    updateForm.image.value = postObject.image;
    updateForm.name.value = postObject.name;
    updateForm.song.value = postObject.song;
    updateForm.year.value = postObject.year;
    updateForm.description.value = postObject.description;
    updateForm.setAttribute("data-id", postObject.id);
    document.querySelector("#dialog-update-post").showModal();
  }
}

function deletePostClicked(event) {
  const id = event.target.getAttribute("data-id");
  deletePost(id);
}

async function deletePost(id) {
  const response = await fetch(`${endpoint}/posts/${id}.json`, {
    method: "DELETE",
  });

  if (response.ok) {
    console.log("Delete post works");
    updatePostsGrid();
  }
}

// Create a new post - HTTP Method: POST
async function createPost(name, song, year, description, image) {
  const newPost = {
    name: name,
    song: song,
    year: year,
    description: description,
    image: image,
  };
  console.log(newPost);
  const json = JSON.stringify(newPost);

  const response = await fetch(`${endpoint}/posts.json`, {
    method: "POST",
    body: json,
  });
  if (response.ok) {
    console.log("New post succesfully added to Firebase");
    updatePostsGrid();
  }
}

function updatePostClicked(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const song = form.song.value;
  const year = form.year.value;
  const description = form.description.value;
  const image = form.image.value;
  const id = form.getAttribute("data-id");
  updatePost(id, name, song, year, description, image);
  document.querySelector("#dialog-update-post").close();
}

async function updatePost(id, name, song, year, description, image) {
  const updatedPost = {
    name: name,
    song: song,
    year: year,
    description: description,
    image: image,
  };
  console.log(updatedPost);
  const json = JSON.stringify(updatedPost);

  const response = await fetch(`${endpoint}/posts/${id}.json`, {
    method: "PUT",
    body: json,
  });

  if (response.ok) {
    console.log("Update post works");
    updatePostsGrid();
  }
}

// create new post object
// convert the JS object to JSON string
// POST fetch request with JSON in the body
// check if response is ok - if the response is successful
// update the post grid to display all posts and the new post

// Update an existing post - HTTP Method: DELETE
// async function deletePost(id) {
// DELETE fetch request
// check if response is ok - if the response is successful
// update the post grid to display posts
// }

// Delete an existing post - HTTP Method: PUT
async function updatePost(id, name, song, year, description, image) {
  const postToUpdate = { name, song, year, description, image };
  const json = JSON.stringify(postToUpdate);
  const response = await fetch(`${endpoint}/posts/${id}.json`, {
    method: "PUT",
    body: json,
  });
  if (response.ok) {
    console.log("Post successfully updated");
    updatePostsGrid();
  }
}

// Convert object of objects to an array of objects
function prepareData(dataObject) {
  const array = []; // Define empty array
  // Loop through every key in dataObject
  // The value of every key is an object
  for (const key in dataObject) {
    const object = dataObject[key]; // Define object
    object.id = key; // Add the key in the prop id
    array.push(object); // Add the object to array
  }
  return array; // Return array back to "the caller"
}

//FORM PAGE CODE.//

// get the list of posts from the server
fetch("/posts")
  .then((response) => response.json())
  .then((posts) => {
    // loop through the list of posts and generate HTML for each one
    posts.forEach((post) => {
      const html = /*html*/ `
        <article class="grid-item">
          <img src="${post.image}" />
          <h3>${post.name} - ${post.song} (${post.year})</h3>
          <p>${post.description}</p>
          <div class="btns">
            <button class="btn-delete">Delete</button>
            <button class="btn-update">Update</button>
          </div>
        </article>
      `;

      // add the HTML for the post to the page
      document.querySelector("#posts").insertAdjacentHTML("beforeend", html);

      // add event listeners to the delete and update buttons
      const lastArticle = document.querySelector("#posts article:last-child");
      lastArticle
        .querySelector(".btn-delete")
        .addEventListener("click", deleteClicked);
      lastArticle
        .querySelector(".btn-update")
        .addEventListener("click", update);
    });
  });




// MAKE 2 COLLUMN GRID
//REMOVE POST DESCRIPTIONS NAME SONG ETC
//REMOVE BORDERS AND OPTION TO UPDATE AND DELETE
//CREATE CLICKEVENT SO YOU CAN CLIOCK ON THE POST
// CREATE DETAIL VIEW SO WHEN CLICKED, YOU CAN SEE THE INFO
//ADD BUTTONS UPDATE AND DELETE IN THE DETAIL VIEW (LOOK AT THE SKETCH TO SEE HOW IT SHOULD LOOK ISH) ive added it in the docs
//CHECK JSON: I THINK MY IMAGES URLS NEED TO BE CHANGED. ONLY MERVES IMAGES ARE SHOWING UP

/*   //FORMS//
  - IS NOT UPDATING THE POST GRID WHEN FORM IS FILLED AND "POST" IS CLICKED
  - GET REDIRECTED TO ALLPOSTS WHEN "POST" IS CLICKED SP YOU CAN SEE THE UPDATED POST GRID 
  */

/*CREATE POP-UPS ? 
- SUCCESSFULLY POSTED
-SUCCESSFULLY DELETED 
-SUCCESSFULLY UPDATED 
-COUD NOT POST AT THE MOMENT, TRY AGAIN  LATER
-COUD NOT UPDATE AT THE MOMENT, TRY AGAIN  LATER

*/

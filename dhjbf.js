"use strict";

const endpoint = "https://projekt-merve-nour-default-rtdb.firebaseio.com/";
let posts;

window.addEventListener("load", initApp);

function initApp() {
  console.log("så dæh nu dåh");
  updatePostsGrid();
  document
    .querySelector("#open-create-post-dialog")
    .addEventListener("click", showCreatePost);
  document
    .querySelector("#form-create-post")
    .addEventListener("submit", createPostClicked);
  //document.querySelector("#form-delete-post").addEventListener("submit", deletePostClicked);
  document
    .querySelector("#form-update-post")
    .addEventListener("submit", updatePostClicked);

  document
    .querySelector("#input-search")
    .addEventListener("keyup", inputSearchChanged);
  document
    .querySelector("#input-search")
    .addEventListener("search", inputSearchChanged);
  document
    .querySelector("#select-sort-by")
    .addEventListener("change", sortPosts);
  document
    .querySelector("#close-create-button")
    .addEventListener("click", hideCreatePost);
}

//------create post-----/
function showCreatePost() {
  console.log("opened create post dialog!");
  const createPostDialog = document.querySelector("#create-post-dialog");
  if (createPostDialog.showModal) {
    createPostDialog.showModal();
  } else {
    // In case the browser does not support the `showModal` method, fall back to displaying the dialog using CSS
    createPostDialog.style.display = "block";
    document.querySelector("#overlay").style.display = "block";
  }
}

function hideCreatePost() {
  console.log("closed create post dialog!");
  const createPostDialog = document.querySelector("#create-post-dialog");
  if (createPostDialog.close) {
    createPostDialog.close();
  } else {
    // In case the browser does not support the `close` method, fall back to hiding the dialog using CSS
    createPostDialog.style.display = "none";
    document.querySelector("#overlay").style.display = "none";
  }
}

function createPostClicked(event) {
  event.preventDefault(); // Prevent form submission and page refresh
  const form = this;
  const image = form.image.value;
  const description = form.description.value;
  const name = form.name.value;
  const year = form.year.value;
  const song = form.song.value;
  createPost(image, description, name, year, song);
  form.reset();
}

async function createPost(image, description, name, year, song) {
  const newPost = {
    image: image,
    description: description,
    name: name,
    year: year,
    song: song,
  };
  const json = JSON.stringify(newPost);
  const response = await fetch(`${endpoint}/posts.json`, {
    method: "POST",
    body: json,
  });
  if (response.ok) {
    console.log("Data added to FireBase!");
    updateDisplayPosts();
  }
}

// ============== events ============== //

function cancelDelete() {
  console.log("cancel btn clicked");
  document.querySelector("#dialog-delete-post").close();
}

function cancelCreate() {
  console.log("cancel create btn clicked");
  document.querySelector("#dialog-create-post").close();
}

// ============== posts ============== //

async function updatePostsGrid() {
  posts = await getPosts(); // get posts from rest endpoint and save in global variable
  showPosts(posts); // show all posts (append to the DOM) with posts as argument
}

// Get all posts - HTTP Method: GET
async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`);
  const data = await response.json();
  const postObjects = Object.entries(data).map(([id, post]) => ({
    ...post,
    id,
  }));
  return postObjects;
}

function showPosts(listOfPosts) {
  document.querySelector("#posts").innerHTML = ""; // reset the content of section#posts

  for (const post of listOfPosts) {
    const html = /*html*/ `
      <article class="grid-item">
        <img src="${post.image}" />
      </article>
    `;

    document.querySelector("#posts").insertAdjacentHTML("beforeend", html);
  }
}

function getPostByImageSrc(imageSrc) {
  for (const post of posts) {
    if (post.image === imageSrc.replace(/&amp;/g, "&")) {
      return post;
    }
  }
  return null;
}

// called when image is clicked
function imageClicked(postObject) {
  console.log("Image clicked");
  document.querySelector("#dialog-full-window .image-container img").src =
    postObject.image;
  document.querySelector("#dialog-full-window .details h3").textContent =
    postObject.name + " - " + postObject.song + " (" + postObject.year + ")";

  // Update these lines with correct selectors
  document.querySelector("#dialog-full-window .details .artist").textContent =
    postObject.name;
  document.querySelector("#dialog-full-window .details .album").textContent =
    postObject.year;

  document.querySelector(
    "#dialog-full-window .details .description"
  ).textContent = postObject.description;

  // Add event listeners for delete and update buttons in the detail view
  document
    .querySelector("#dialog-full-window .btn-delete")
    .addEventListener("click", () => deleteClicked(postObject));
  document
    .querySelector("#dialog-full-window .btn-update")
    .addEventListener("click", () => updateClicked(postObject));

  // Open the dialog
  document.querySelector("#dialog-full-window").showModal();
}

function deleteClicked(postObject) {
  // Implement delete functionality
}

async function deleteClicked(postObject) {
  const postId = postObject.id;
  const response = await fetch(`${endpoint}/posts/${postId}.json`, {
    method: "DELETE",
  });

  if (response.ok) {
    // Close the full-window dialog
    document.querySelector("#dialog-full-window").close();

    // Update the posts grid
    updatePostsGrid();
  } else {
    alert("Error deleting the post. Please try again.");
  }
}

function updateClicked(postObject) {
  // Implement update functionality
}

function showUpdatePostDialog(postObject) {
  const form = document.querySelector("#form-update-post");

  // Pre-fill the form with existing post data
  form.image.value = postObject.image;
  form.description.value = postObject.description;
  form.name.value = postObject.name;
  form.year.value = postObject.year;
  form.song.value = postObject.song;

  // Open the update post dialog
  document.querySelector("#dialog-update-post").showModal();
}

function updateClicked(postObject) {
  showUpdatePostDialog(postObject);
}

async function updatePostClicked(event) {
  event.preventDefault();
  const form = event.target;
  const image = form.image.value;
  const description = form.description.value;
  const name = form.title.value;
  const year = form.year.value;
  const song = form.song.value;
  const postId = form.postId.value; // Assuming you added a hidden input with postId in the update post form

  const updatedPost = {
    image,
    description,
    name,
    year,
    song,
  };

  const response = await fetch(`${endpoint}/posts/${postId}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPost),
  });

  if (response.ok) {
    // Close the update post dialog
    document.querySelector("#dialog-update-post").close();

    // Update the posts grid
    updatePostsGrid();
  } else {
    alert("Error updating the post. Please try again.");
  }
}

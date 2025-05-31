import checkAuth from "./auth.js";

const postsPerPage = 3;
let currentPage = 1;

// On page load, fetch the posts
document.addEventListener("DOMContentLoaded", async () => {
  const data = await checkAuth();
  if (!data) {
    window.location.href = "/login";
  }
  const logoutBtn = document.getElementById("logoutBtn");
  const createPostBtn = document.getElementById("createPostBtn");
  logoutBtn.addEventListener("click", logout);
  createPostBtn.addEventListener("click", createPost);

  getPosts();
});

// Fetch posts from the server
const getPosts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Invalid Token!");
    const res = await fetch("/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      renderPosts(data.posts);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error Fetching Posts:", error);
  }
};

// Render the posts into the DOM with pagination
const renderPosts = (posts) => {
  const postList = document.getElementById("postList");
  const pagination = document.getElementById("pagination");
  postList.innerHTML = "";

  if (posts.length === 0) {
    postList.innerHTML = "<p>No posts available.</p>";
    pagination.innerHTML = "";
    return;
  }

  // Calculate slice indices for the current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  // Render posts for the current page
  paginatedPosts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    const postText = document.createElement("div");
    postText.className = "post-text";
    postText.textContent = post.text;

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-post-btn";
    editButton.addEventListener("click", () => editPost(post));

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-post-btn";
    deleteButton.addEventListener("click", () => deletePost(post._id));

    postDiv.appendChild(postText);
    postDiv.appendChild(editButton);
    postDiv.appendChild(deleteButton);
    postList.appendChild(postDiv);
  });

  // Create pagination buttons
  const totalPages = Math.ceil(posts.length / postsPerPage);
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderPosts(posts);
    });
    // Highlight the active page button
    if (i === currentPage) {
      pageButton.style.fontWeight = "bold";
    }
    pagination.appendChild(pageButton);
  }
};

// Create a new post
const createPost = async () => {
  const text = document.getElementById("text").value;
  if (!text) return alert("Post text cannot be empty");
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Invalid Token!");
  try {
    const response = await fetch("/posts/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById("text").value = "";
      currentPage = 1; // Reset to first page after new post
      getPosts(); // Refresh list
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error creating post");
  }
};

// Prompt for editing and then update the post
const editPost = (post) => {
  const newText = prompt("Edit your post:", post.text);
  if (newText !== null && newText !== post.text) {
    updatePost(post._id, newText);
  }
};

// Update a post via the API
const updatePost = async (postId, text) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Invalid Token!");
    const response = await fetch(`/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    if (response.ok) {
      getPosts(); // Refresh list
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error updating post");
  }
};

// Delete a post via the API
const deletePost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Invalid Token!");
    const response = await fetch(`/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      getPosts();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error deleting post");
  }
};

// Logout by redirecting to the logout endpoint
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  window.location.href = "/login";
};

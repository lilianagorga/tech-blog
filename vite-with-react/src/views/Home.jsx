import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios.js";
import TButton from "../components/core/TButton.jsx";
import Post from "./Post.jsx";
import { createSlug } from "../utils/utils.jsx";
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: ''});
  const { showToast } = useStateContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);


  useEffect(()=>{
    setLoading(true);
    axiosClient
      .get(`/home`)
      .then((res)=>{
        setLoading(false);
        setData(res.data);
        return res;
      })
      .catch((error)=>{
        setLoading(false);
        return error;
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosClient.get('/categories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosClient.get('/posts')
      .then((res) => {
        setPosts(res.data.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        showToast("Error fetching posts!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  const filterPostsByCategory = (category) => {
    navigate(`/${category.slug}`, {
      state: {
      posts: getPostsByCategory(category.id),
      category: category
    }});
  };

  const getPostsByCategory = (categoryId) => {
    return posts.filter(post =>
      post.categories.some(category => category.id === categoryId)
    );
  }


  const handlePostInput = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleCreatePost = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const slug = createSlug(formData.get('title'));
    const active = true;
    const category = formData.get('category');

    let payload = {
      title: formData.get('title'),
      body: formData.get('body'),
      slug,
      active,
      categories: [category],
    };

    axiosClient.post('/posts', payload)
      .then((response) => {
        setPosts(prevPosts => [...prevPosts, response.data]);
        showToast("Post created successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error creating post:', error);
        showToast("Error creating post!");
      });
  };

  const deletePost = (postId) => {
    if (window.confirm('Are you sure you want to remove this post?')) {
      axiosClient.delete(`/posts/${postId}`)
        .then(() => {
          setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
          showToast("Post deleted successfully!");
        })
        .catch((error) => {
          showToast(`Error deleting category : ${error.message}`);
        });
    }
  };

  // const updatePost = (updatePost) => {
  //   setPosts(prevPosts =>
  //     prevPosts.map(post => post.id === updatePost.id ? updatePost : post)
  //   );
  //   showToast("Post updated successfully!");
  // };

  return (
    <PageComponent title="Tech Blog">
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="overflow-y-auto mx-8 py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
          <div className="border-4 border-gray-800 rounded-lg shadow-xl p-6">
            <ul className="text-white flex flex-wrap justify-between">
              {categories.map((category) => (
                <li key={category.id} className="p-2">
                  <TButton color="indigo" onClick={() => filterPostsByCategory(category)}>
                    {category.title}
                  </TButton>
                </li>
              ))}
            </ul>
          </div>
          <div className="shadow-lg rounded-lg p-6 border-1 my-16 mx-auto max-w-screen-lg">
            <form onSubmit={handleCreatePost} className="flex gap-4 items-center justify-center form-element-border:hover">
              <input
                className="rounded mb-2 px-4 py-2 form-element-border"
                style={{ width: 'calc(25% - 1rem)' }}
                type="text"
                name="title"
                value={newPost.title}
                onChange={handlePostInput}
                placeholder="Title"
                required
              />
              <select name="category" className="rounded mb-2 px-4 form-element-border py-2 text-gray-500" style={{ width: 'calc(30% - 1rem)' }}>
                <option>Select a Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
              <textarea
                className="rounded px-4 py-2 form-element-border"
                style={{ width: 'calc(45% - 1rem)' }}
                name="body"
                value={newPost.body}
                onChange={handlePostInput}
                placeholder="What are you thinking ?"
                required
              />
              <TButton color="indigo" type="submit">Post</TButton>
            </form>
          </div>
          <div className="rounded-lg shadow-xl p-6 border-4 border-gray-800">
            <ul className="text-white grid grid-cols-3 gap-4 posts-list posts-list:hover">
              {posts.map(post => (
                <Post
                  key={post.id}
                  post={post}
                  deletePost={deletePost}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </PageComponent>
  );
}

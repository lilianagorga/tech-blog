import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios.js";
import TButton from "../components/core/TButton.jsx";
import Post from "./Post.jsx";
import { createSlug } from "../utils/utils.jsx";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: ''});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { showToast } = useStateContext();
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(()=>{
    setLoading(true);
    axiosClient
      .get(`/dashboard`)
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

  useEffect (() => {
    setLoading(true);
    axiosClient.get('/posts')
      .then(response => {
        setPosts(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        showToast("Error fetching posts!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCategoryPost = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setLoading(true);
    axiosClient.get(`/category/${categorySlug}`)
      .then((res) => {
        setFilteredPosts(res.data.data);
      })
      .catch((error) => {
        console.error('Error fetching posts by category:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetPosts = () => {
    setFilteredPosts([]);
  };

  const handlePostInput = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    const slug = createSlug(newPost.title);
    const active = true;
    const payload = {
      ...newPost,
      slug,
      active
    };
    axiosClient.post('/posts', payload)
      .then((response) => {
        setPosts(prevPosts => [...prevPosts, response.data]);
        setNewPost({title: '', body: ''});
        showToast("Post created successfully!");
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
  //
  // const updatePost = (updatePost) => {
  //   setPosts(prevPosts =>
  //     prevPosts.map(post => post.id === updatePost.id ? updatePost : post)
  //   );
  //   showToast("Post updated successfully!");
  // };

  return (
    <PageComponent title="Dashboard">
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-4 overflow-y-auto mx-8 py-4 px-3 bg-gray-50 gap-4 rounded dark:bg-gray-800">
          <div className="grid col-span-1">
            <h2 className="text-white fond-bold">Categories</h2>
            <ul className="text-white">
              {categories.map((category) => (
                <li key={category.id} className="p-8">
                  <TButton color="indigo" onClick={() => handleCategoryPost(category.slug)}>
                    {category.title}
                  </TButton>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid col-span-1">
            <form onSubmit={handleCreatePost}>
              <input
                className="rounded mb-2"
                type="text"
                name="title"
                value={newPost.title}
                onChange={handlePostInput}
                placeholder="Title"
                required
              />
              <textarea
                className="rounded"
                name="body"
                value={newPost.body}
                onChange={handlePostInput}
                placeholder="What are you thinking ?"
                required
              />
              <TButton color="indigo" type="submit">Post</TButton>
            </form>
          </div>
          <div className="rounded grid col-span-1">
            <ul className="text-white">
              {posts.map((post) => (
                <Post key={post.id} post={post} isFilteredPost={false} deletePost={deletePost} />
              ))}
            </ul>
          </div>
          {selectedCategory && (
            <div className="rounded grid col-span-1">
              <ul className="text-white">
                {filteredPosts.map((post) => (
                  <Post key={post.id} post={post} isFilteredPost={true} resetPosts={resetPosts} deletePost={deletePost} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </PageComponent>
  );
}

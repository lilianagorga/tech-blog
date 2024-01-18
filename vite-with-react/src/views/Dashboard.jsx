import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios.js";
import TButton from "../components/core/TButton.jsx";
import Post from "./Post.jsx";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);

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


  const handleCategoryClick = (categorySlug) => {
    setLoading(true);
    axiosClient.get(`/category/${categorySlug}`)
      .then((res) => {
        setPosts(res.data.data);
      })
      .catch((error) => {
        console.error('Error fetching posts by category:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  const resetPosts = () => {
    setPosts([]);
  };

  return (
    <PageComponent title="Dashboard">
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-2 overflow-y-auto mx-8 py-4 px-3 bg-gray-50 gap-4 rounded dark:bg-gray-800">
          <div>
            <h2 className="grid col-span-1 text-white fond-bold ">Categories</h2>
            <ul className="grid col-span-1 text-white">
              {categories.map((category) => (
                <li key={category.id} className="p-8">
                  <TButton color="indigo" onClick={() => handleCategoryClick(category.slug)}>
                    {category.title}
                  </TButton>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded">
            <ul className="text-white">
              {posts.map((post) => (
                <Post key={post.id} post={post} resetPosts={resetPosts}/>
              ))}
            </ul>
          </div>
        </div>
      )}
    </PageComponent>
  );
}

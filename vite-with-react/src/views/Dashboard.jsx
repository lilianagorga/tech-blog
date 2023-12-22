import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios.js";
import TButton from "../components/core/TButton.jsx";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

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

  return (
    <PageComponent title="Dashboard">
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
          <TButton link>
            <EyeIcon className="w-5 h-5 mr-2" />
            View Posts
          </TButton>
        </div>
      )}
    </PageComponent>
  );
}

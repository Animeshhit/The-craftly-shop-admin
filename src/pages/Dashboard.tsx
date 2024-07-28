import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { useToast } from "../components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setProgress } from "../store/Slices/LoadingSlice";

interface dashboardDataType {
  users: number;
  banners: number;
  products: number;
  catagories: number;
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const [dashboardData, setDashBoardData] = useState<dashboardDataType | null>(
    null
  );
  const { toast } = useToast();
  const getDashBoard = async () => {
    try {
      dispatch(setProgress(30));
      axios
        .get(`${import.meta.env.VITE_BASE_API_URL}/dashboard`)
        .then((res: any) => {
          let { data }: { data: dashboardDataType } = res;
          console.log(data);
          setDashBoardData(data);
          dispatch(setProgress(100));
        })
        .catch((err) => {
          console.log(err);
          setDashBoardData(null);
          toast({
            variant: "destructive",
            title: "Error",
            description: "something went wrong",
          });
          dispatch(setProgress(100));
        });
    } catch (err) {
      console.log(err);
      setDashBoardData(null);
      toast({
        title: "Network Connection Error",
        description: "Poor Network connection please try again later",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              location.reload();
            }}
          >
            Try again
          </ToastAction>
        ),
      });
      dispatch(setProgress(100));
    }
  };

  useEffect(() => {
    getDashBoard();
  }, []);
  return (
    <>
      <div className="flex items-center gap-6">
        <Card className="py-4 px-6 text-center shadow-lg w-1/2">
          <div className="w-max mx-auto mb-3">
            <svg
              width="56"
              height="56"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>

          <h1 className="text-2xl">Authenticated users</h1>
          <h3 className="text-4xl font-bold mt-3">
            {dashboardData ? dashboardData.users : 0}
          </h3>
        </Card>
        <Card className="py-4 px-6 text-center shadow-lg w-1/2">
          <div className="w-max mx-auto mb-3">
            <svg
              width="56"
              height="56"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl">Anonymous users</h1>
          <h3 className="text-4xl font-bold mt-3">0</h3>
        </Card>
      </div>
      <div className="flex items-center gap-6 mt-7">
        <Card className="py-4 px-6 text-center shadow-lg w-1/2">
          <div className="w-max mx-auto mb-3">
            <svg
              width="56"
              height="56"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5C1 1.67157 1.67157 1 2.5 1ZM2.5 2C2.22386 2 2 2.22386 2 2.5V8.3636L3.6818 6.6818C3.76809 6.59551 3.88572 6.54797 4.00774 6.55007C4.12975 6.55216 4.24568 6.60372 4.32895 6.69293L7.87355 10.4901L10.6818 7.6818C10.8575 7.50607 11.1425 7.50607 11.3182 7.6818L13 9.3636V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM2 12.5V9.6364L3.98887 7.64753L7.5311 11.4421L8.94113 13H2.5C2.22386 13 2 12.7761 2 12.5ZM12.5 13H10.155L8.48336 11.153L11 8.6364L13 10.6364V12.5C13 12.7761 12.7761 13 12.5 13ZM6.64922 5.5C6.64922 5.03013 7.03013 4.64922 7.5 4.64922C7.96987 4.64922 8.35078 5.03013 8.35078 5.5C8.35078 5.96987 7.96987 6.35078 7.5 6.35078C7.03013 6.35078 6.64922 5.96987 6.64922 5.5ZM7.5 3.74922C6.53307 3.74922 5.74922 4.53307 5.74922 5.5C5.74922 6.46693 6.53307 7.25078 7.5 7.25078C8.46693 7.25078 9.25078 6.46693 9.25078 5.5C9.25078 4.53307 8.46693 3.74922 7.5 3.74922Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl">Total Banner</h1>
          <h3 className="text-4xl font-bold mt-3">
            {dashboardData ? dashboardData.banners : 0}
          </h3>
        </Card>
        <Card className="py-4 px-6 text-center shadow-lg w-1/2">
          <div className="w-max mx-auto mb-3">
            <svg
              width="56"
              height="56"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 2H1.5C1.22386 2 1 2.22386 1 2.5V7H7V2ZM8 2V7H14V2.5C14 2.22386 13.7761 2 13.5 2H8ZM7 8H1V12.5C1 12.7761 1.22386 13 1.5 13H7V8ZM8 13V8H14V12.5C14 12.7761 13.7761 13 13.5 13H8ZM1.5 1C0.671573 1 0 1.67157 0 2.5V12.5C0 13.3284 0.671573 14 1.5 14H13.5C14.3284 14 15 13.3284 15 12.5V2.5C15 1.67157 14.3284 1 13.5 1H1.5Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl">Total Categories</h1>
          <h3 className="text-4xl font-bold mt-3">
            {dashboardData ? dashboardData.catagories : 0}
          </h3>
        </Card>
      </div>
      <Card className="py-4 px-6 text-center shadow-lg w-1/2 mt-7">
        <div className="w-max mx-auto mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="56"
            viewBox="0 -960 960 960"
            width="56"
            fill="#aaaaa"
          >
            <path d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z" />
          </svg>
        </div>
        <h1 className="text-2xl">Total Products</h1>
        <h3 className="text-4xl font-bold mt-3">
          {dashboardData ? dashboardData.products : 0}
        </h3>
      </Card>
    </>
  );
};

export default Dashboard;

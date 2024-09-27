import { useEffect, useState, useCallback } from "react";

//others
import axios from "axios";
import { bannerType } from "../types/BannerType";
import { Button } from "../components/ui/button";
import BannerCard from "../components/BannerCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";

import { useDropzone, DropzoneOptions } from "react-dropzone";
import getToken from "../helper/token";
import getImageBaseUrl from "../helper/getImageBaseUrl";
import { useToast } from "../components/ui/use-toast";
import { ToastAction } from "../components/ui/toast";

//firebase
import storage from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//redux
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/Slices/userSlice";
import { setBanners } from "../store/Slices/bannerSlice";
import { ReloadIcon } from "@radix-ui/react-icons";
import { setProgress } from "../store/Slices/LoadingSlice";

const Banners = () => {
  const dispatch = useDispatch();
  const banners = useSelector((s: any) => s.banners);
  const [createBannerBtn, setCreateBannerBtn] = useState<boolean>(false);
  const { toast } = useToast();
  // new banner
  interface newBannerDataType {
    bannerText: string;
    bannerLink: string;
  }
  const initialNewBannerData = {
    bannerLink: "",
    bannerText: "",
  };
  const [newBannerData, setNewBannerData] =
    useState<newBannerDataType>(initialNewBannerData);

  const handleChangeOfNewBannerData = (e: any) => {
    setNewBannerData({ ...newBannerData, [e.target.name]: e.target.value });
  };

  // dropzone =======================================

  const [preview, setPreview] = useState<ArrayBuffer[] | string[] | null>(null);

  const [previewForPhone, setPreviewForPhone] = useState<
    ArrayBuffer[] | string[] | null
  >(null);

  // preview image url ============================================================

  // getting banners=======================================================

  const getBanners = async () => {
    try {
      dispatch(setProgress(40));
      axios
        .get(`${import.meta.env.VITE_BASE_API_URL}/banners`)
        .then((res) => {
          let { data } = res;
          dispatch(setProgress(100));
          dispatch(setBanners(data));
        })
        .catch((err) => {
          dispatch(setBanners([]));
          console.log(err);
          dispatch(setProgress(100));
          toast({
            variant: "destructive",
            title: "Error",
            description: "something went wrong",
          });
        });
    } catch (err) {
      dispatch(setBanners([]));
      console.log(err);
      dispatch(setProgress(100));
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please Check Your Network Connection",
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
    }
  };

  // ==============================deleting the banner ====================
  const deleteBanner = async (
    id: string,
    setdtbtn: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      let token = getToken();
      if (!token) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please Login again",
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
        dispatch(login(false));
        return;
      }
      setdtbtn(true);
      dispatch(setProgress(30));
      axios
        .delete(
          `${
            import.meta.env.VITE_ADMIN_API_URL
          }/deleteabannerimage?bannerId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          let { data } = res;
          let updatedBanners = banners.filter((banner: any) => {
            return banner._id !== id;
          });
          dispatch(setBanners(updatedBanners));
          setdtbtn(false);
          dispatch(setProgress(100));
          toast({ title: data.message });
        })
        .catch((err) => {
          console.log(err);
          setdtbtn(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: "something went wrong",
          });
          dispatch(setProgress(100));
        });
    } catch (err) {
      console.log(err);
      setdtbtn(false);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please Check Your Network Connection",
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
  // deleting banner end ================================================

  // Dropzone========================================================
  const onDrop: DropzoneOptions["onDrop"] = useCallback(() => {
    // acceptedFiles &&
    //   Object.keys(acceptedFiles).forEach(async function (_, index) {
    //     getImageBaseUrl(acceptedFiles[index]);
    //   });
  }, []);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: {
        "image/png": [".png"],
        "image/jpg": [".jpg"],
        "image/jpeg": [".jpeg"],
        "image/webp": [".webp"],
      },
      onDrop,
    });

  const onDropZoneTwo: DropzoneOptions["onDrop"] = useCallback(() => {}, []);

  const {
    acceptedFiles: FilesForPhone,
    getInputProps: getInputPropsPhone,
    getRootProps: getRootPropsPhone,
    isDragActive: isDragActivePhone,
  } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "image/webp": [".webp"],
    },
    onDrop: onDropZoneTwo,
  });

  useEffect(() => {
    dispatch(setProgress(50));
    if (Array.isArray(acceptedFiles)) {
      if (!acceptedFiles.length) {
        setPreview([]);
      }
    }
    acceptedFiles && acceptedFiles.length
      ? getImageBaseUrl(acceptedFiles, setPreview)
      : "";
    dispatch(setProgress(100));
  }, [acceptedFiles]);

  useEffect(() => {
    dispatch(setProgress(50));
    if (Array.isArray(FilesForPhone)) {
      if (!FilesForPhone.length) {
        setPreviewForPhone([]);
      }
      FilesForPhone && FilesForPhone.length
        ? getImageBaseUrl(FilesForPhone, setPreviewForPhone)
        : "";
    }
    dispatch(setProgress(100));
  }, [FilesForPhone]);

  useEffect(() => {
    getBanners();
  }, []);

  // ========================creating new banner from server =============================
  const createNewBannerImage = async () => {
    try {
      let token = getToken();

      if (!token) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please Login again",
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
        dispatch(login(false));
        return;
      }

      let { bannerLink }: newBannerDataType = newBannerData;

      if (bannerLink == "" || !bannerLink) {
        toast({
          variant: "destructive",
          title: "Validation Erorr",
          description: "please Provide BannnerLink",
        });
        return;
      }

      if (!acceptedFiles.length) {
        toast({
          variant: "destructive",
          title: "Validation Erorr",
          description: "please Provide BannerImage",
        });
        return;
      }

      if (!FilesForPhone.length) {
        toast({
          variant: "destructive",
          title: "Validation Erorr",
          description: "please Provide BannerImage For Phone",
        });
        return;
      }

      setCreateBannerBtn(true);
      // file uploaded ========================================
      const storageRef = ref(storage, "uploads/" + acceptedFiles[0].name);

      const uploadTask = uploadBytesResumable(storageRef, acceptedFiles[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          dispatch(setProgress(progress)); // Update the progress bar
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            (bannerImage: string) => {
              const storageRefForPhone = ref(
                storage,
                "uploads/" + FilesForPhone[0]
              );

              const uploadforphoneTask = uploadBytesResumable(
                storageRefForPhone,
                FilesForPhone[0]
              );

              uploadforphoneTask.on(
                "state_changed",
                (snap) => {
                  const progress =
                    (snap.bytesTransferred / snap.totalBytes) * 100;
                  dispatch(setProgress(progress));
                },
                (err) => {
                  console.error("Upload failed:", err);
                },
                () => {
                  getDownloadURL(uploadforphoneTask.snapshot.ref).then(
                    (phoneBannerImage: string) => {
                      // uploading the image link to server
                      axios
                        .post(
                          `${import.meta.env.VITE_ADMIN_API_URL}/addnewbanner`,
                          {
                            bannerImage,
                            phoneBannerImage,
                            bannerLink,
                            bannerText: newBannerData.bannerText,
                          },
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        )
                        .then((res) => {
                          let { data } = res;
                          console.log(data);
                          toast({ title: data.message });
                          dispatch(setBanners([...banners, data.banner]));
                          dispatch(setProgress(100));
                          setCreateBannerBtn(false);
                        })
                        .catch((err) => {
                          setCreateBannerBtn(false);
                          dispatch(setProgress(100));
                          console.log(err);
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description: "something went wrong",
                          });
                        });
                    }
                  );
                }
              );
            }
          );
        }
      );
    } catch (err) {
      console.log(err);
      setCreateBannerBtn(false);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please Check Your Network Connection",
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
    } finally {
      setNewBannerData(initialNewBannerData);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between max-w-[1200px]">
        <h1 className="text-2xl font-semibold font-poppins">Banners</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={createBannerBtn} type="button">
              {createBannerBtn ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Add New Banner"
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Banner details</DialogTitle>
              <DialogDescription>Fill The details properly</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* dropzone ======================================================= */}
              <div className="flex items-center gap-3 flex-col">
                <div
                  {...getRootProps()}
                  className="w-[350px] h-[140px] border-2 border-zinc-800 border-dashed rounded-md flex items-center justify-center"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-gray-500">Drop Your Files Here</p>
                  ) : (
                    <div className="w-full h-full">
                      <div className="w-full h-full flex items-center justify-center">
                        {preview && preview?.length ? (
                          preview.map((item) => {
                            return (
                              <img
                                draggable={false}
                                className="w-full object-contain h-full rounded-md"
                                src={item as string}
                              />
                            );
                          })
                        ) : (
                          <div className="text-center mt-3">
                            <p className="text-xs">1920 X 600</p>
                            <Button variant="outline" className="mt-3 text-xs">
                              Select files
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  {...getRootPropsPhone()}
                  className="w-[120px] h-[180px] border-2 border-zinc-800 border-dashed rounded-md flex items-center justify-center"
                >
                  <input {...getInputPropsPhone()} />
                  {isDragActivePhone ? (
                    <p className="text-gray-500">Drop Your Files Here</p>
                  ) : (
                    <div className="w-full h-full">
                      <div className="w-full h-full flex items-center justify-center">
                        {previewForPhone && previewForPhone?.length ? (
                          previewForPhone.map((item) => {
                            return (
                              <img
                                draggable={false}
                                className="w-full object-contain h-[200px] rounded-md"
                                src={item as string}
                              />
                            );
                          })
                        ) : (
                          <div className="text-center mt-3">
                            <p className="text-xs">375/400/500 X 350</p>
                            <Button variant="outline" className="mt-3 text-xs">
                              Select files
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* dropzone================================================================ */}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bannerText" className="text-right">
                  Banner Text
                </Label>
                <Input
                  id="bannerText"
                  name="bannerText"
                  value={newBannerData.bannerText}
                  onChange={handleChangeOfNewBannerData}
                  placeholder="eg:rakhi"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bannerLink" className="text-right">
                  Banner Link
                </Label>
                <Input
                  id="bannerLink"
                  name="bannerLink"
                  value={newBannerData.bannerLink}
                  onChange={handleChangeOfNewBannerData}
                  placeholder="eg:thecraftly.shop/categories/categories-name"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              {newBannerData.bannerLink == "" ||
              !newBannerData.bannerLink ||
              !acceptedFiles ? (
                <Button
                  disabled={createBannerBtn}
                  type="submit"
                  onClick={createNewBannerImage}
                >
                  {createBannerBtn ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Save banner"
                  )}
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button
                    disabled={createBannerBtn}
                    type="submit"
                    onClick={createNewBannerImage}
                  >
                    {createBannerBtn ? (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Save banner"
                    )}
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-12 max-w-[1200px]">
        {banners == null ? (
          <>
            {Array.from({ length: 5 }).map(() => {
              return <Skeleton className="bg-zinc-800 mb-6 w-full h-[450px]" />;
            })}
          </>
        ) : banners.length > 0 ? (
          <>
            {banners.map((banner: bannerType) => {
              if (banner.isMainImage) {
                return <BannerCard data={banner} deleteBanner={deleteBanner} />;
              }
            })}
            {banners.map((banner: bannerType, index: any) => {
              if (!banner.isMainImage) {
                return (
                  <BannerCard
                    data={banner}
                    key={index}
                    deleteBanner={deleteBanner}
                  />
                );
              }
            })}
          </>
        ) : (
          "No Banner Found"
        )}
      </div>
    </>
  );
};

export default Banners;

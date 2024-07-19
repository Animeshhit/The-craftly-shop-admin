//core
import React, { useState, useCallback, useEffect } from "react";

//others
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import MarkdownEditor from "../components/Markdown";
// import ComboBox from "../components/ComboBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { getCategories } from "../helper/categoriesHelper/ctg";
import { NewProductType } from "../types/NewProductType";
import getToken from "../helper/token";
import { ReloadIcon } from "@radix-ui/react-icons";
// react dropzone
import { useDropzone, DropzoneOptions } from "react-dropzone";

//redux
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/Slices/userSlice";
import axios from "axios";

const AddProduct = ({
  setProgress,
}: {
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // ctg
  const dispatch = useDispatch();
  let ctg = useSelector((s: any) => s.ctg);
  const [mainImageUrlPreview, setMainImageUrlPreview] = useState<
    string | undefined
  >(undefined);
  const [publicBtn, setPublishBtn] = useState<boolean>(false);
  // react dropzone ====================================

  // ===========================preview ======================================
  const [preview, setPreview] = useState<ArrayBuffer[] | string[] | null>(null);

  // preview image url ============================================================

  const getImageBaseUrl = (image: File) => {
    setPreview([]);
    let file = new FileReader();
    file.onload = function () {
      setPreview((prevPreview: any) => {
        if (Array.isArray(prevPreview)) {
          return [...prevPreview, file.result];
        }
        return [file.result];
      });
    };
    file.readAsDataURL(image);
  };
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

  //   ====================data taking from the form ===============

  const initialNewProduct = {
    name: {
      value: "",
      error: false,
    },
    stock: {
      value: undefined,
      error: false,
    },
    productUniqueId: {
      value: "",
      error: false,
    },
    basePrice: {
      value: undefined,
      error: false,
    },
    discountedPrice: {
      value: undefined,
      error: false,
    },
    categories: {
      value: "",
      error: false,
    },
    mainImage: {
      value: "",
      error: false,
    },
    isFeatured: false,
    isBestSeller: false,
  };
  const [newProductData, setNewProductData] =
    useState<NewProductType>(initialNewProduct);
  const [markdown, setMarkDown] = useState<string>("");
  // const [uploadedImages, setUploadedImages] = useState<string[] | []>([]);

  const createNewProduct = async () => {
    let token = getToken();

    if (!token) {
      alert("Session Expired");
      dispatch(login(false));
      return;
    }
    let {
      name,
      stock,
      productUniqueId,
      basePrice,
      discountedPrice,
      categories,
      mainImage,
      isBestSeller,
      isFeatured,
    }: NewProductType = newProductData;
    // name
    if (name.value === "" || name.value == null || name.value == undefined) {
      alert("Please Provide Product Name Description");
      setNewProductData({
        ...newProductData,
        name: { value: "", error: true },
      });
      return;
    }
    //stock
    if (stock.value === "" || stock.value == null || stock.value == undefined) {
      alert("Please Provide Product stock Number");
      setNewProductData({
        ...newProductData,
        stock: { value: undefined, error: true },
      });
      return;
    }
    // productUniqueId
    if (
      productUniqueId.value === "" ||
      productUniqueId.value == null ||
      productUniqueId.value == undefined
    ) {
      alert("Please Provide product Unique ID");
      setNewProductData({
        ...newProductData,
        productUniqueId: { value: "", error: true },
      });
      return;
    }
    // basePrice
    if (
      basePrice.value === "" ||
      basePrice.value == null ||
      basePrice.value == undefined
    ) {
      alert("Please Provide Product Base Price");
      setNewProductData({
        ...newProductData,
        basePrice: { value: undefined, error: true },
      });
      return;
    }
    // discountedPrice
    if (
      discountedPrice.value === "" ||
      discountedPrice.value == null ||
      discountedPrice.value == undefined
    ) {
      alert("Please Provide Product Discounted Price");
      setNewProductData({
        ...newProductData,
        discountedPrice: { value: undefined, error: true },
      });
      return;
    }
    // categories
    if (
      categories.value === "" ||
      categories.value == null ||
      categories.value == undefined
    ) {
      alert("Please Provide Product categories");
      setNewProductData({
        ...newProductData,
        categories: { value: "", error: true },
      });
      return;
    }
    // mainImage
    if (
      mainImage.value === "" ||
      mainImage.value == null ||
      mainImage.value == undefined
    ) {
      alert("Please Provide Product mainImage URL in 4:4 ratio");
      setNewProductData({
        ...newProductData,
        mainImage: { value: "", error: true },
      });
      return;
    }
    if (markdown == "" || markdown == null || markdown == undefined) {
      alert("Please Provide Product Description");
      return;
    }
    if (!acceptedFiles.length) {
      alert("please provide prodcut show case images");
      return;
    }
    setPublishBtn(true);
    setProgress(30);
    // file uploaded ========================================
    const uploadPreset = import.meta.env.VITE_CLD_UPLOADPRESET;

    const uploaders = Array.from(acceptedFiles).map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      return axios
        .post(import.meta.env.VITE_CLD_UPLOAD_URL, formData)
        .then((response) => response.data);
    });
    setProgress(50);
    const uploadedFilesData = await Promise.all(uploaders);
    setProgress(80);
    // file uploaded end ========================================
    const uploadedUrls = uploadedFilesData.map(
      (uploaded) => uploaded.secure_url
    );

    let DATA = {
      name: name.value,
      description: markdown,
      price: basePrice.value,
      discount: discountedPrice.value,
      productImage: mainImage.value,
      productImages: uploadedUrls,
      catagories: categories.value,
      productUniqueId: productUniqueId.value,
      stock: stock.value,
      isFeatured,
      isBestSeller,
    };
    try {
      axios
        .post(`${import.meta.env.VITE_ADMIN_API_URL}/createnewproduct`, DATA, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          let { data } = res;
          alert(data.message);
          setNewProductData(initialNewProduct);
          setPublishBtn(false);
          console.log(data);
          setProgress(100);
        })
        .catch((err) => {
          console.log(err);
          setPublishBtn(false);
          setProgress(100);
          alert("something went wrong");
        });
    } catch (err) {
      console.log(err);
      setPublishBtn(false);
      setProgress(100);
      alert("Network connection error");
    }
  };

  useEffect(() => {
    if (Array.isArray(acceptedFiles)) {
      if (!acceptedFiles.length) {
        setPreview([]);
      }
    }
    acceptedFiles &&
      Object.keys(acceptedFiles).forEach(async function (_, index) {
        getImageBaseUrl(acceptedFiles[index]);
      });
  }, [acceptedFiles]);

  useEffect(() => {
    if (
      newProductData.mainImage.value == "" ||
      !newProductData.mainImage.value
    ) {
      setMainImageUrlPreview(undefined);
      return;
    }
    setMainImageUrlPreview(newProductData.mainImage.value);
  }, [newProductData.mainImage]);

  // const [combobox, setCombox] = useState<string>("");

  return (
    <>
      {/* header  */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-poppins">
            Add a New Product
          </h1>
          <p className="text-gray-500 text-sm">
            Orders placed across your store
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button disabled>Discard</Button>
          <Button variant="secondary">Save draft</Button>
          <Button
            disabled={publicBtn}
            onClick={() => {
              createNewProduct();
            }}
          >
            {publicBtn ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              " Publish product"
            )}
          </Button>
        </div>
      </div>
      {/* form  */}

      <div className="flex mt-12 items-start gap-6">
        {/* left card  */}
        <div className="flex-1 h-auto">
          <Card className="flex-1 h-auto pb-20">
            <CardHeader>
              <CardTitle className="text-lg font-normal">
                Product information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      value={newProductData.name.value}
                      name="name"
                      id="name"
                      className={
                        newProductData.name.error
                          ? "border-2 border-red-600"
                          : ""
                      }
                      onChange={(e: any) => {
                        setNewProductData({
                          ...newProductData,
                          name: { value: e.target.value, error: false },
                        });
                      }}
                      placeholder="Name of your product"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-1/2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      type="number"
                      value={newProductData.stock.value}
                      name="stock"
                      id="stock"
                      className={
                        newProductData.stock.error
                          ? "border-2 border-red-600"
                          : ""
                      }
                      onChange={(e: any) => {
                        setNewProductData({
                          ...newProductData,
                          stock: { value: e.target.value, error: false },
                        });
                      }}
                      placeholder="Number of stock"
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="puniqueid">Product Unique Id</Label>
                    <Input
                      type="text"
                      value={newProductData.productUniqueId.value}
                      className={
                        newProductData.productUniqueId.error
                          ? "border-2 border-red-600"
                          : ""
                      }
                      onChange={(e: any) => {
                        setNewProductData({
                          ...newProductData,
                          productUniqueId: {
                            value: e.target.value,
                            error: false,
                          },
                        });
                      }}
                      name="productUniqueId"
                      id="puniqueid"
                      placeholder="Product unique ID"
                    />
                  </div>
                </div>
                <MarkdownEditor value={markdown} setValue={setMarkDown} />
              </form>
            </CardContent>
          </Card>
          {/* other  */}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-normal">
                Product Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className="w-full h-[300px] overflow-auto border-2 border-zinc-800 border-dashed rounded-md flex items-center justify-center"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-gray-500">Drop Your Files Here</p>
                ) : (
                  <div>
                    <div className="flex items-center flex-col gap-1">
                      {preview && preview?.length ? (
                        preview.map((item) => {
                          return (
                            <img
                              draggable={false}
                              className="w-[80px] h-[80px] rounded-md"
                              src={item as string}
                            />
                          );
                        })
                      ) : (
                        <div className="text-center mt-3">
                          <p>Drag And Drop Files Here 4:4</p>
                          <Button className="mt-3">Select files</Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* right card  */}
        <div className=" w-[350px]">
          {/* top card  */}
          {/* pricing  */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="bprice">Base Price</Label>
                    <Input
                      type="number"
                      value={newProductData.basePrice.value}
                      className={
                        newProductData.basePrice.error
                          ? "border-2 border-red-600"
                          : ""
                      }
                      onChange={(e: any) => {
                        setNewProductData({
                          ...newProductData,
                          basePrice: { value: e.target.value, error: false },
                        });
                      }}
                      name="basePrice"
                      id="bprice"
                      placeholder="Price"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="dprice">Discounted Price</Label>
                    <Input
                      type="number"
                      id="dprice"
                      value={newProductData.discountedPrice.value}
                      className={
                        newProductData.discountedPrice.error
                          ? "border-2 border-red-600"
                          : ""
                      }
                      onChange={(e: any) => {
                        setNewProductData({
                          ...newProductData,
                          discountedPrice: {
                            value: e.target.value,
                            error: false,
                          },
                        });
                      }}
                      name="discountedPrice"
                      placeholder="Discounted Price"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          {/* end card  */}
          {/* categories */}
          <Card className="mt-6 w-full">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Organize</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Select
                      onOpenChange={() => {
                        !ctg && getCategories();
                      }}
                      value={newProductData.categories.value}
                      onValueChange={(event) => {
                        setNewProductData({
                          ...newProductData,
                          categories: { value: event, error: false },
                        });
                      }}
                    >
                      <SelectTrigger
                        className={`w-full ${
                          newProductData.categories.error
                            ? "border-2 border-red-600"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Select Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {ctg == null ? (
                          <p className="px-4">Loading...</p>
                        ) : ctg.length ? (
                          ctg.map((c: any, index: any) => (
                            <SelectItem key={index} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))
                        ) : (
                          "Not Found"
                        )}
                      </SelectContent>
                    </Select>

                    {/* <ComboBox
                      labelText="Select categories"
                      searchLabelText="categories"
                      //   frameworks={frameworks}
                      value={combobox}
                      setValue={setCombox}
                    /> */}
                  </div>
                  <div className="flex items-center space-x-2 w-full">
                    <Checkbox
                      id="isFeatured"
                      checked={newProductData.isFeatured}
                      onCheckedChange={(c: boolean) => {
                        setNewProductData({
                          ...newProductData,
                          isFeatured: c,
                        });
                      }}
                    />
                    <label
                      htmlFor="isFeatured"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Featured product
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 w-full">
                    <Checkbox
                      id="isBestSeller"
                      checked={newProductData.isBestSeller}
                      onCheckedChange={(c: boolean) => {
                        setNewProductData({
                          ...newProductData,
                          isBestSeller: c,
                        });
                      }}
                    />
                    <label
                      htmlFor="isBestSeller"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Bestseller product
                    </label>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          {/* main image card  */}
          <Card className="mt-6 w-full">
            <CardHeader>
              <CardTitle className="text-lg font-normal">
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="mimage">Main Image</Label>
                    <Input
                      value={newProductData.mainImage.value}
                      className={`${
                        newProductData.mainImage.error
                          ? "border-2 border-red-600"
                          : ""
                      }`}
                      onChange={(e: any) => {
                        setNewProductData({
                          ...newProductData,
                          mainImage: { value: e.target.value, error: false },
                        });
                      }}
                      name="mainImage"
                      id="mimage"
                      placeholder="Main Image URL 4X4"
                    />
                  </div>
                  {mainImageUrlPreview && (
                    <div className="flex flex-col space-y-1.5">
                      <img src={mainImageUrlPreview} className="w-full" />
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* main image card  */}
          {/* <Card className="mt-6 w-full">
            <CardHeader>
              <CardTitle className="text-lg font-normal">
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="mimage">Main Image</Label>
                    <Input id="mimage" placeholder="Main Image URL" />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card> */}

          {/* variants card  */}
          <Card className="mt-6 w-full">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Variants Will Be Done Later 🚀🚀</p>
              {/* <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="mimage">Main Image</Label>
                    <Input id="mimage" placeholder="Main Image URL" />
                  </div>
                </div>
              </form> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AddProduct;

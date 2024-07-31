//core
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
import getToken from "../helper/token";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "../components/ui/use-toast";
// react dropzone
import { useDropzone, DropzoneOptions } from "react-dropzone";

//redux
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/Slices/userSlice";
import { setProgress } from "../store/Slices/LoadingSlice";
import axios from "axios";
import { ToastAction } from "../components/ui/toast";
import { CircleX } from "lucide-react";

const EditProduct = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  // ctg
  const dispatch = useDispatch();
  const { toast } = useToast();
  let ctg = useSelector((s: any) => s.ctg);
  const [publicBtn, setPublishBtn] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<boolean>(false);
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

  const [name, setName] = useState<string>("");
  const [basePrice, setBasePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [productUniqueId, setProductUniqueId] = useState("");

  const [markdown, setMarkDown] = useState<string>("");
  const [ctgValue, setCtgValue] = useState("");
  const [isFeaturedProduct, setIsFeaturedProduct] = useState(false);
  const [isBestSellerProduct, setIsBestSellerProduct] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [mainImageUrlPreview, setMainImageUrlPreview] = useState<
    string | undefined
  >(undefined);

  const [tags, setTags] = useState<string>("");
  const [tagsMain, setTagsMain] = useState<string[] | []>([]);

  const handleTagChange = (e: any) => {
    const value = e.target.value;
    const words = value.split(" ");
    setTags(value);

    if (value.endsWith(" ")) {
      setTagsMain([...tagsMain, words[words.length - 2]]);
      setTags("");
    }
  };

  // =====================================Edit Work =============================
  const getAProductToEdit = async (productId: string) => {
    try {
      dispatch(setProgress(30));
      getCategories();
      dispatch(setProgress(50));
      axios
        .get(`${import.meta.env.VITE_BASE_API_URL}/product?id=${productId}`)
        .then((res) => {
          let { data } = res;
          let { product } = data;

          setName(product.name);
          setBasePrice(product.price);
          setStock(product.stock);
          setProductUniqueId(product.productUniqueId);
          setDiscount(product.discount);
          setCtgValue(product.catagories);
          setIsFeaturedProduct(product.isFeatured);
          setIsBestSellerProduct(product.isBestSeller);
          setMainImageUrl(product.productImage);
          setMarkDown(product.description);
          setTagsMain(product.tags);
          setProductToEdit(true);
          dispatch(setProgress(100));
        })
        .catch((err) => {
          console.log(err);
          alert("something went wrong");
          dispatch(setProgress(100));
          navigate("/products", { replace: true });
        });
    } catch (err) {
      console.log(err);
      alert("Network Connection Error");
      dispatch(setProgress(100));
      navigate("/products", { replace: true });
    }
  };

  const editProduct = async () => {
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

      // name
      if (name === "" || name == null || name == undefined) {
        toast({
          variant: "destructive",
          title: "Validation Erorr",
          description: "Please Provide Product Name Description",
        });
        return;
      }
      //description
      if (markdown == "" || markdown == null || markdown == undefined) {
        toast({
          variant: "destructive",
          title: "Validation Erorr",
          description: "Please Provide Product Description",
        });
        return;
      }

      // basePrice
      if (basePrice === "" || basePrice == null || basePrice == undefined) {
        toast({
          variant: "destructive",
          title: "Validation Erorr",
          description: "Please Provide Product Base Price",
        });
        return;
      }

      // discountedPrice
      if (discount === "" || discount == null || discount == undefined) {
        toast({
          variant: "destructive",
          title: "Validation Erorr",
          description: "Please Provide Product Discounted Price",
        });
        return;
      }

      // mainImage
      if (
        mainImageUrl === "" ||
        mainImageUrl == null ||
        mainImageUrl == undefined
      ) {
        toast({
          variant: "destructive",
          title: "Validation Erorr",
          description: "Please Provide Product mainImage URL in 4:4 ratio",
        });
        return;
      }

      // categories
      if (ctgValue === "" || ctgValue == null || ctgValue == undefined) {
        toast({
          variant: "destructive",
          title: "Validation Erorr",
          description: "Please select categories",
        });
        return;
      }
      // productUniqueId
      if (
        productUniqueId === "" ||
        productUniqueId == null ||
        productUniqueId == undefined
      ) {
        toast({
          variant: "destructive",
          title: "Validation Erorr",
          description: "Please Provide product Unique ID",
        });
        return;
      }
      setPublishBtn(true);
      dispatch(setProgress(30));
      // file uploaded ========================================
      const uploadPreset = import.meta.env.VITE_CLD_UPLOADPRESET;

      let uploadedUrls = null;

      if (acceptedFiles.length > 0) {
        const uploaders = Array.from(acceptedFiles).map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);

          return axios
            .post(import.meta.env.VITE_CLD_UPLOAD_URL, formData)
            .then((response) => response.data);
        });
        dispatch(setProgress(40));
        const uploadedFilesData = await Promise.all(uploaders);
        dispatch(setProgress(80));
        // file uploaded end ========================================
        uploadedUrls = uploadedFilesData.map((uploaded) => uploaded.secure_url);
      }

      let DATA = {
        name,
        description: markdown,
        price: basePrice,
        discount: discount,
        productImage: mainImageUrl,
        catagories: ctgValue,
        productImages: uploadedUrls,
        productUniqueId: productUniqueId,
        stock: stock,
        tags: tagsMain,
        isFeatured: isFeaturedProduct,
        isBestSeller: isBestSellerProduct,
      };
      axios
        .post(
          `${import.meta.env.VITE_ADMIN_API_URL}/editaproduct?id=${id}`,
          DATA,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          let { data } = res;
          let { product } = data;

          setName(product.name);
          setBasePrice(product.price);
          setStock(product.stock);
          setProductUniqueId(product.productUniqueId);
          setDiscount(product.discount);
          setCtgValue(product.catagories);
          setIsFeaturedProduct(product.isFeatured);
          setIsBestSellerProduct(product.isBestSeller);
          setMainImageUrl(product.productImage);
          setMarkDown(product.description);
          setTagsMain(product.tags);
          dispatch(setProgress(100));
          setPublishBtn(false);
          toast({ title: data.message });
        })
        .catch((err) => {
          console.log(err);
          setPublishBtn(false);
          dispatch(setProgress(100));
          toast({
            variant: "destructive",
            title: "Error",
            description: "something went wrong",
          });
        });
    } catch (err) {
      console.log(err);
      setPublishBtn(false);
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

  const TagRemovalFunction = (item: string) => {
    const updatedItems = tagsMain.filter((Item) => Item !== item);
    setTagsMain(updatedItems);
  };

  useEffect(() => {
    dispatch(setProgress(50));
    if (Array.isArray(acceptedFiles)) {
      if (!acceptedFiles.length) {
        setPreview([]);
      }
    }
    acceptedFiles &&
      Object.keys(acceptedFiles).forEach(async function (_, index) {
        getImageBaseUrl(acceptedFiles[index]);
      });
    dispatch(setProgress(100));
  }, [acceptedFiles]);

  useEffect(() => {
    if (!id || id === undefined) return;
    getAProductToEdit(id);
  }, [id]);

  useEffect(() => {
    if (mainImageUrl == "" || !mainImageUrl) {
      setMainImageUrlPreview(undefined);
    }
    setMainImageUrlPreview(mainImageUrl);
  }, [mainImageUrl]);

  // loading page will be here
  if (!productToEdit) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* header  */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-poppins">
            {id ? "Edit Product" : "  Add a New Product"}
          </h1>
          <p className="text-gray-500 text-sm">
            Orders placed across your store
          </p>
        </div>
        <div className="flex items-center gap-4">
          {!id && <Button variant="secondary">Save draft</Button>}
          <Button
            disabled={publicBtn}
            onClick={() => {
              editProduct();
            }}
          >
            {publicBtn ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Edit product"
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
                      value={name}
                      name="name"
                      id="name"
                      onChange={(e: any) => {
                        setName(e.target.value);
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
                      value={stock}
                      name="stock"
                      id="stock"
                      onChange={(e: any) => {
                        setStock(e.target.value);
                      }}
                      placeholder="Number of stock"
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="puniqueid">Product Unique Id</Label>
                    <Input
                      type="text"
                      value={productUniqueId}
                      onChange={(e: any) => {
                        setProductUniqueId(e.target.value);
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
                Add Extra Product Image
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
                      value={basePrice}
                      onChange={(e: any) => {
                        setBasePrice(e.target.value);
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
                      value={discount}
                      onChange={(e: any) => {
                        setDiscount(e.target.value);
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
                      value={ctgValue}
                      onValueChange={(event) => {
                        setCtgValue(event);
                      }}
                    >
                      <SelectTrigger className={`w-full`}>
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
                      checked={isFeaturedProduct}
                      onCheckedChange={(c: boolean) => {
                        setIsFeaturedProduct(c);
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
                      checked={isBestSellerProduct}
                      onCheckedChange={(c: boolean) => {
                        setIsBestSellerProduct(c);
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
                      value={mainImageUrl}
                      onChange={(e: any) => {
                        setMainImageUrl(e.target.value);
                      }}
                      name="mainImage"
                      id="mimage"
                      placeholder="Main Image URL 4X4"
                    />
                  </div>
                  {mainImageUrlPreview && (
                    <div className="flex flex-col space-y-1.5 h-[300px]">
                      <img
                        src={mainImageUrlPreview}
                        className="w-full h-full"
                        loading="lazy"
                      />
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

          {/* Tags  */}

          <Card className="mt-6 w-full">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={tags}
                onChange={handleTagChange}
                placeholder="For Mens "
                className="w-full border-2 h-[100px] py-2 px-3 rounded-md outline-none resize-x-none"
              >
                <p>Work</p>
              </textarea>

              {tagsMain.length > 0 && (
                <div className="w-full rounded-md flex items-center flex-wrap gap-3  mt-3 py-2 px-4">
                  {tagsMain.length
                    ? tagsMain.map((item: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className="text-xs bg-gray-300 w-max py-1 px-2 rounded-full flex items-center gap-2"
                          >
                            <p className="capitalize"> {item}</p>
                            <CircleX
                              className="w-3 h-3 cursor-pointer"
                              onClick={() => {
                                TagRemovalFunction(item);
                              }}
                            />
                          </div>
                        );
                      })
                    : ""}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Tags End  */}

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

export default EditProduct;

//core
import { useState, useCallback } from "react";

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
import ComboBox from "../components/ComboBox";

// react dropzone
import { useDropzone, DropzoneOptions } from "react-dropzone";

const AddProduct = () => {
  // react dropzone ====================================
  const onDrop: DropzoneOptions["onDrop"] = useCallback(
    (acceptedFiles: any) => {
      acceptedFiles &&
        Object.keys(acceptedFiles).forEach(async function (_, index) {
          getImageBaseUrl(acceptedFiles[index]);
        });
    },
    []
  );
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop });

  //   ====================data taking from the form ===============
  const [markdown, setMarkDown] = useState<string>("");
  const [combobox, setCombox] = useState<string>("");

  // for the image
  const [preview, setPreview] = useState<ArrayBuffer[] | string[] | null>(null);

  //function for getting the image url

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
            onClick={() => {
              console.log(acceptedFiles);
            }}
          >
            Publish product
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
                    <Input id="name" placeholder="Name of your product" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-1/2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      type="number"
                      id="stock"
                      placeholder="Number of stock"
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="puniqueid">Product Unique Id</Label>
                    <Input
                      type="text"
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
                className="w-full h-[300px] border-2 border-zinc-800 border-dashed rounded-md flex items-center justify-center"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-gray-500">Drop Your Files Here</p>
                ) : (
                  <div>
                    <div className="flex items-center gap-1">
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
                          <p>Drag And Drop Files Here</p>
                          <Button className="mt-3">Select files</Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={() => {
                  setPreview([]);
                }}
                className="mt-6 w-full"
                variant="outline"
                type="button"
              >
                Remove All
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* right card  */}
        <div className=" w-[350px]">
          {/* top card  */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="bprice">Base Price</Label>
                    <Input type="number" id="bprice" placeholder="Price" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="dprice">Discounted Price</Label>
                    <Input
                      type="number"
                      id="dprice"
                      placeholder="Discounted Price"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          {/* end card  */}
          <Card className="mt-6 w-full">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Organize</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <ComboBox
                      labelText="Select categories"
                      searchLabelText="categories"
                      //   frameworks={frameworks}
                      value={combobox}
                      setValue={setCombox}
                    />
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
                    <Input id="mimage" placeholder="Main Image URL" />
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
                    <Input id="mimage" placeholder="Main Image URL" />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* variants card  */}
          <Card className="mt-6 w-full">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Variants Will Be Here Soon 🚀🚀</p>
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

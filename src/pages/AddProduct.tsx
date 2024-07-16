//core
import { useState } from "react";

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

const AddProduct = () => {
  //   ====================data taking from the form ===============
  const [markdown, setMarkDown] = useState<string>("");
  const [combobox, setCombox] = useState<string>("");

  return (
    <>
      {/* header  */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Add a new Product</h1>
          <p className="text-gray-500">Orders placed across your store</p>
        </div>
        <div className="flex items-center gap-4">
          <Button disabled>Discard</Button>
          <Button variant="secondary">Save draft</Button>
          <Button>Publish product</Button>
        </div>
      </div>
      {/* form  */}

      <div className="flex mt-12 items-start gap-6">
        {/* left card  */}
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
          {/* last card  */}
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
        </div>
      </div>

      {/* other  */}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-normal">Product Image</CardTitle>
        </CardHeader>
      </Card>
    </>
  );
};

export default AddProduct;

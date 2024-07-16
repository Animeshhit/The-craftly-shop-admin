import { Switch } from "./ui/switch";
import { Label } from "@radix-ui/react-label";

const ProductCard = () => {
  return (
    <>
      <div className="card flex items-center py-2 justify-between max-w-[850px] mb-4 bg-white shadow-lg px-4 border-2 rounded-md">
        <h3 className="font-semibold text-xl">Airdopes 131</h3>
        <h6 className="py-2 px-3 rounded-full text-xs bg-zinc-800 text-white">
          1398/-
        </h6>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Switch id="featured" />
            <Label htmlFor="featured">Featured</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="bestseller" />
            <Label htmlFor="bestseller">Bestseller</Label>
          </div>
          <div className="flex items-center justify-center p-3 rounded-md transition cursor-pointer hover:bg-zinc-300">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;

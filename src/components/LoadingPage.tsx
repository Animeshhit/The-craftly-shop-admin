import React from "react";
import { Skeleton } from "./ui/skeleton"; // Adjust the import according to your project's setup

const LoadingPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="bg-zinc-800 h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="bg-zinc-800 h-4 w-1/3" />
          <Skeleton className="bg-zinc-800 h-4 w-1/4" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="bg-zinc-800 h-32" />
        <Skeleton className="bg-zinc-800 h-32" />
        <Skeleton className="bg-zinc-800 h-32" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="bg-zinc-800 h-32" />
        <Skeleton className="bg-zinc-800 h-32" />
        <Skeleton className="bg-zinc-800 h-32" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="bg-zinc-800 h-32" />
        <Skeleton className="bg-zinc-800 h-32" />
        <Skeleton className="bg-zinc-800 h-32" />
      </div>

      <div className="space-y-2">
        <Skeleton className="bg-zinc-800 h-4 w-full" />
        <Skeleton className="bg-zinc-800 h-4 w-full" />
        <Skeleton className="bg-zinc-800 h-4 w-1/2" />
      </div>

      <div className="flex justify-end">
        <Skeleton className="bg-zinc-800 h-10 w-24" />
      </div>
    </div>
  );
};

const ProductsLoadingPage: React.FC = () => {
  const rows = Array.from({ length: 8 }); // Adjust the number of rows as needed

  return (
    <div className="p-4 max-w-[1200px]">
      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Product
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Categories
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <Skeleton className="bg-zinc-800 h-6 w-12 rounded" />
                </td>
                <td className="px-4 py-2 flex items-center space-x-4">
                  <Skeleton className="bg-zinc-800 h-10 w-10 rounded-full" />
                  <Skeleton className="bg-zinc-800 h-6 w-3/4" />
                </td>
                <td className="px-4 py-2">
                  <Skeleton className="bg-zinc-800 h-6 w-24 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoadingPage;
export { ProductsLoadingPage };

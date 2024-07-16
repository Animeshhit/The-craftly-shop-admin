import ProductCard from "../components/ProductCard";
const Products = () => {
  return (
    <>
      <h1 className="text-2xl">Products</h1>
      <div className="mt-8">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </>
  );
};

export default Products;

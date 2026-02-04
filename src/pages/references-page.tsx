import { Reviews23 } from "@/components/shop/reviews23";
import { Reviews3 } from "@/components/shop/reviews3";

const ReferencesPage = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto flex w-full flex-col items-center justify-center">
        <Reviews23 reviews={[]} className="w-full" />
        <Reviews3 reviews={[]} title="Reference pacientů" className="w-full" />
      </div>
    </div>
  );
};

export default ReferencesPage;

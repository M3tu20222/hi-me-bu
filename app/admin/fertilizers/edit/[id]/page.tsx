import { notFound } from "next/navigation";
import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import FertilizerForm from "@/components/admin/FertilizerForm";
import dbConnect from "@/lib/dbConnect";
import { Fertilizer, Season } from "@/lib/models";

async function EditFertilizerPage({ params }: { params: Params }) {
  await dbConnect();
  const fertilizer = await Fertilizer.findById(params.id).populate("season");
  const seasons = await Season.find({ status: "Aktif" }).sort({
    startDate: -1,
  });

  if (!fertilizer) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-neon-blue">Gübre Düzenle</h1>
      <FertilizerForm
        fertilizer={JSON.parse(JSON.stringify(fertilizer))}
        seasons={JSON.parse(JSON.stringify(seasons))}
      />
    </div>
  );
}

export default EditFertilizerPage;

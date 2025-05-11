import PredictForm from "./PredictionForm";

const PredictionPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Prédiction du type de transaction</h1>
      <PredictForm />
    </div>
  );
};

export default PredictionPage;

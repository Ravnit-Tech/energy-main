"use client";
import PmsTankSimulation from "../../components/PmsTankSimulation";
import AtkTankSimulation from "../../components/AtkTankSimulation";
import AgoTankSimulation from "../../components/AgoTankSimulation";
import React, { useEffect } from "react";
import Head from "next/head";
import { useDepot } from "../../context/DepotContext";

const DEPOT_NAME = "Enugu Fuel Depot";

function EnuguFuelDepot() {
  const { depotProducts, activeProduct, setActiveProduct, setSelectedDepot, depotLogos } = useDepot();
  const products = depotProducts[DEPOT_NAME];

  useEffect(() => { setSelectedDepot(DEPOT_NAME); }, []);

  const renderTankSimulation = () => {
    switch (activeProduct) {
      case "PMS":
        return <PmsTankSimulation level={products.PMS.level} logo={depotLogos[DEPOT_NAME]} />;
      case "ATK":
        return <AtkTankSimulation level={products.ATK.level} logo={depotLogos[DEPOT_NAME]} />;
      case "AGO":
        return <AgoTankSimulation level={products.AGO.level} logo={depotLogos[DEPOT_NAME]} />;
      default:
        return <PmsTankSimulation level={products.PMS.level} logo={depotLogos[DEPOT_NAME]} />;
    }
  };

  return (
    <>
      <Head><title>Enugu Fuel Depot | e-Nergy</title></Head>
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-stretch justify-center w-full gap-4 md:gap-6">
        <div className="w-full lg:w-[500px] xl:w-[600px]">
          <div className="w-full h-[450px] md:h-[510px] lg:h-[calc((100vh-100px)*0.85)] shadow-2xl p-2 md:p-4 flex flex-col">
            <div className="flex justify-center gap-2 md:gap-3 mb-3 md:mb-4 flex-wrap">
              {(["PMS", "ATK", "AGO"] as const).map((item) => {
                const colors = {
                  PMS: { active: "bg-blue-500", hover: "hover:bg-blue-300" },
                  ATK: { active: "bg-yellow-500", hover: "hover:bg-yellow-300" },
                  AGO: { active: "bg-orange-500", hover: "hover:bg-orange-300" },
                };

                return (
                  <button
                    key={item}
                    onClick={() => setActiveProduct(item)}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-bold text-xs md:text-sm transition-all duration-200 shadow-md
                      ${activeProduct === item ? `${colors[item].active} text-white scale-105` : `bg-white/90 text-gray-700 ${colors[item].hover}`}`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <div className="flex-1 min-h-0">{renderTankSimulation()}</div>
          </div>
        </div>

        <div className="w-full lg:w-[500px] xl:w-[600px] flex items-center justify-center">
          <div className="w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-orange-400 px-4 md:px-6 py-3 md:py-4">
              <h2 className="text-center font-bold text-lg md:text-2xl text-white">ENERGY OIL PRODUCTS</h2>
              <p className="text-center text-white text-xs md:text-sm mt-1 opacity-90">Enugu Fuel Depot</p>
            </div>
            <div className="p-3 md:p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left font-bold text-gray-700 text-xs md:text-base">Product</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left font-bold text-gray-700 text-xs md:text-base">Status</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left font-bold text-gray-700 text-xs md:text-base">Price</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left font-bold text-gray-700 text-xs md:text-base">Remaining (L)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(products).map(([key, data]) => (
                      <tr key={key} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-2 md:px-4 py-3 md:py-4 font-bold text-gray-800 text-xs md:text-base">{key}</td>
                        <td className={`px-2 md:px-4 py-3 md:py-4 font-bold text-xs md:text-base ${data.status === "Available" ? "text-green-600" : "text-yellow-500"}`}>
                          {data.status}
                        </td>
                        <td className="px-2 md:px-4 py-3 md:py-4 text-gray-600 font-semibold text-xs md:text-base">{data.price}</td>
                        <td className="px-2 md:px-4 py-3 md:py-4 text-gray-600 text-xs md:text-base">
                          {Number(data.quantity.split("/")[1] ?? 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default EnuguFuelDepot;

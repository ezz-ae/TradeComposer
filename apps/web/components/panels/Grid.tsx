import Feeds from "./Feeds";
import SensorMatrix from "./SensorMatrix";
import Regime from "./Regime";
import TradeManagement from "./TradeManagement";
import Backtest from "./Backtest";
import ParameterOptimization from "./ParameterOptimization";

export default function Grid() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 text-white">
      <div className="col-span-1">
        <Feeds />
      </div>
      <div className="col-span-1">
        <SensorMatrix />
      </div>
      <div className="col-span-1">
        <Regime />
      </div>
      <div className="col-span-3">
        <TradeManagement />
      </div>
      <div className="col-span-2">
        <Backtest />
      </div>
      <div className="col-span-1">
        <ParameterOptimization />
      </div>
    </div>
  );
}

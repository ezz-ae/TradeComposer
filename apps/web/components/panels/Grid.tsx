import Feeds from './Feeds';
import SensorMatrix from './SensorMatrix';
import Regime from './Regime';
import MatcherBank from './MatcherBank';
import Composer from './Composer';
import Patchboard from './Patchboard';
import TradeEngine from './TradeEngine';
import Trader from './Trader';
import Portfolio from './Portfolio';
import Journal from './Journal';

export default function Grid() {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 p-4">
      <div className="col-span-1 row-span-1">
        <Feeds />
      </div>
      <div className="col-span-1 row-span-1">
        <SensorMatrix />
      </div>
      <div className="col-span-1 row-span-1">
        <Regime />
      </div>
      <div className="col-span-1 row-span-1">
        <MatcherBank />
      </div>
      <div className="col-span-1 row-span-1">
        <Composer />
      </div>
      <div className="col-span-1 row-span-1">
        <Patchboard />
      </div>
      <div className="col-span-2 row-span-1 bg-gray-800 p-4 rounded-lg">
        <TradeEngine />
        <Trader />
      </div>
      <div className="col-span-1 row-span-1">
        <Portfolio />
      </div>
      <div className="col-span-1 row-span-1">
        <Journal />
      </div>
    </div>
  );
}

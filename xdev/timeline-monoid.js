// this module needs to refactor
// there is a better way to implement
const freeMonoid = (operator) => (() => {
  const flattenDeep = (arr1) => arr1
    .reduce((acc, val) => Array.isArray(val)
      ? acc.concat(flattenDeep(val))
      : acc.concat(val), []);
  const M = (() => { //(M)(a)(b)
    const toList = arr => arr.reduce((a, b) => (a)(b), (M));
    const m = (a) => (Array.isArray(a))
      ? toList(flattenDeep(a))
      : (!!a && !!a.M)
        ? (a)
        : (() => {
          const ma = b => (b === m) // right id
            ? (ma)
            : !b.M
              ? (ma)(M(b))
              : (() => {
                const mab = M();
                mab.units = ma.units.concat(b.units);
                mab.val = mab.units.map(unit => unit.val[0]);
                return mab; // (m)(a)(b)
              })();
          ma.M = m;
          ma.val = [a];
          ma.units = [ma];
          operator(ma);
          return ma;
        })();
    m.M = m;
    m.val = [m]; //["__IDENTITY__"];
    m.units = [m];
    operator(m);
    return (m);
  })();
  return M;
})();
//Timeline monoid based on freeMonoid =============
const now = "now";

const mlog = (msg) => (m) => {
  console.log(msg + ": " + m);
  return m;
};
const _T = () => freeMonoid(operator);
const operator = (timeline) => {
  const T = timeline.M;
  Object.defineProperties(timeline, //detect TL update
    {
      now: { //timeline[now]
        get() {
          return timeline.value[0];
        },
        set(tUpdate) {
          return (() => {
            timeline.value = [tUpdate];
            timeline._wrapF.map(f => f(tUpdate));
          })();
        }
      }
    });
  timeline.value = [];
  timeline.sync = f => {
    const syncTL = T();
    timeline._eval()._wrap(val => (syncTL[now] = f(val)));
    return syncTL;
  };
  timeline._wrapF = [];
  timeline._wrap = f => {
    timeline._wrapF[timeline._wrapF.length] = f;
    return timeline;
  };
  timeline._eval = () => (timeline.evaluated)
    || (timeline.units.length === 1)
    ? timeline
    : (() => {
      timeline.evaluated = true;
      const reset = () => timeline.units
        .map((t, i) => updates[i][now] = 0);
      const update = () => timeline[now] = timeline.units
        .map((t) => t[now]);
      const check = () => (timeline.units
        .map((t, i) => updates[i][now])
        .reduce((a, b) => (a * b)) === 1) //all updated
        ? update()
        : true;
      const updates = timeline.units
        .map((t) => T()._wrap(check));
      const dummy0 = timeline.units
        .map((t, i) => t._wrap(() => updates[i][now] = 1));
      const dummy1 = timeline._wrap(reset);
      timeline[now] = null; //initial reset
      return timeline;
    })();
  //------------------
  timeline._timeF = () => (typeof timeline.val[0]
    === "function") //_wrapped eventF
    ? timeline.val[0](timeline)
    : true;
  //non-lazy evaluate on the creation of timeF TL
  timeline._timeF();
}; //-------operator
const T = _T();
//------------------

export { T, now, mlog };


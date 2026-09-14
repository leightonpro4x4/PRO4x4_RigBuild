// Explicit test-only adapter. Never used by the production catalogue or validator.
export function alpha93FixtureCatalogue(fixture) {
  const vehicleId='alpha93-regression-only';
  return {vehicles:[{vehicleId}],products:Object.entries(fixture.products).map(([id,p])=>({identity:`${vehicleId}::${id}`,vehicleId,data:{...p,id,status:'confirmed'}}))};
}

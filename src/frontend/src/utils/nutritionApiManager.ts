import { FoodModel } from "../models/nutritionModels";

const APPID = "d8f2f005";
const APPKEY = "496194121a4c8fc220a3be43b062e920";

export function search(
  term: string,
  signal: AbortSignal | null = null
): Promise<FoodModel[]> {
  const url = new URL(`https://trackapi.nutritionix.com/v2/search/instant`);
  url.searchParams.set("query", term);
  return fetch(url, {
    method: "GET",
    headers: {
      "X-APP-ID": APPID,
      "X-APP-KEY": APPKEY,
    },
    signal,
  })
    .then((response) => response.json())
    .then((data) => {
      let rawData: any = [];
      Object.keys(data).forEach((key) => {
        rawData = [...rawData, ...data[key]];
      });

      return rawData.map((p: any) => ({
        name: p.food_name,
        calories: p.nf_calories || 0,
      }));
    });
}

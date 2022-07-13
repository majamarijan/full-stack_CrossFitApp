export const loadData = async function () {
  const url = "/api/v1/workouts";
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (err) {
    return new Error("Something went wrong");
  }
}


export const getCard = async function (id) {
  const url = `/api/v1/workouts/workout/${id}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (err) {
    return new Error("Something went wrong");
  }
}
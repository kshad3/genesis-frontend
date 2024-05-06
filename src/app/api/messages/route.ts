export async function POST() {
  const data = {
    message: "i am a sample response",
  };
  return Response.json(data);
}

import * as express from "express";
import * as Redis from "ioredis";
import got from "got";

const redis = new Redis();

const app = express();

app.get("/bar", (req, res) => {
  res.json({ status: "ok" });  
});

async function fromRedis() {
  try {
    await redis.set("foo", 42);
    const result = await redis.get("foo");
    return result;
  } catch (e) {
    console.log(e);
  }

  return "43";
}

app.get("/foo", async (req, res) => {
  const { body } = await got("http://localhost:7000/bar");
  const result = await fromRedis();
	res.send(`${result} ${body}\n`);
});

app.listen(7000, () => {
	console.log('listening');
});

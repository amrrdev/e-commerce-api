/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $match: {
      product: new ObjectId("66ba7caa3f5159daf02c74dc"),
    },
  },
  {
    $group: {
      _id: "$product",
      averageRating: {
        $avg: "$rating",
      },
      numberOfRating: {
        $sum: 1,
      },
    },
  },
];

const client = await MongoClient.connect(
  "mongodb+srv://aamr46095:MJ8Jlo4ezNIOAypt@e-commerce.kmqvd.mongodb.net/"
);
const coll = client.db("e-commerce").collection("reviews");
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();

import { z } from "zod";

enum Hobbies {
  Programming,
  WeightLifting,
  Guitar,
}

// const hobbies = ["Programming", "Weigth Lifting", "Guitar"] as const

const NameSchema = z.object({
  name: z.string(),
  //   id: z.union([z.string(), z.number()]),
  id: z.string().or(z.number()),
  discUnionValue: z.discriminatedUnion("status", [
    z.object({ status: z.literal("success"), data: z.string() }),
    z.object({ status: z.literal("failed"), error: z.instanceof(Error) }),
  ]),
  recordValue: z.record(z.string(), z.number()),
  mapValue: z.map(z.string(), z.object({ name: z.string() })),
  setValue: z.set(z.number()),
});

const PromiseSchema = z.object({ promiseValue: z.promise(z.string()) });

const EmailSchema = z.object({
  emailValue: z
    .string()
    .email()
    .refine((val) => val.endsWith("@helloworld.com"), {
      message: "Email must end with @helloworld.com",
    }),
});

const UserSchema = z
  .object({
    username: z.string(),
    age: z.number().default(Math.random),
    birthday: z.date(),
    isProgrammer: z.boolean(),
    //   hobby: z.enum(["Programming", "Weigth Lifting", "Guitar"]),
    // hobby: z.enum(hobbies),
    hobby: z.nativeEnum(Hobbies),
    coords: z.tuple([z.number(), z.number(), z.string()]),
    manyValues: z.tuple([z.string(), z.date()]).rest(z.number()),
  })
  .merge(NameSchema)
  .merge(PromiseSchema)
  .merge(EmailSchema);

type User = z.infer<typeof UserSchema>;

const user: User = {
  id: "some number",
  username: "Hello",
  age: 22,
  birthday: new Date(),
  isProgrammer: true,
  //   hobby: "Programming",
  hobby: Hobbies.Programming,
  name: "World",
  coords: [1, 2, "hi"],
  manyValues: ["There", new Date(), 1, 2, 3, 4, 5],
  discUnionValue: { status: "success", data: "Hello world!" },
  recordValue: {
    qwe: 1,
    asd: 2,
    zxc: 4,
  },
  mapValue: new Map([
    ["id-name", { name: "Hello" }],
    ["id-second", { name: "World" }],
  ]),
  setValue: new Set([1, 1, 1, 1, 2, 3, 4, 5, 555, 6, 6, 6, 6, 6]),
  promiseValue: Promise.resolve("Hello there"),
  emailValue: "Hello@helloworld.com",
};

export const validate = () => {
  console.log(UserSchema.safeParse(user));
  console.log(UserSchema.parse(user));
  console.log(UserSchema.partial().parse({ age: 22 }));
};
